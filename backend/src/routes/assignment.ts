import express, { Request, Response } from "express";
import multer from "multer";
import { assignmentQueue } from "../config/bullmq";
import redisClient from "../config/redis";
import Assignment from "../models/Assignment";
import GeneratedPaper from "../models/GeneratedPaper";
import { extractTextFromFile } from "../services/fileService";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, PDF files allowed"));
    }
  },
});

// GET all assignments
router.get("/", async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET single assignment
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create assignment with optional file
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { title, dueDate, questionTypes, additionalInstructions } = req.body;

    if (!title || !dueDate || !questionTypes) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
      return;
    }

    // Parse questionTypes if it's a string
    const parsedQuestionTypes =
      typeof questionTypes === "string"
        ? JSON.parse(questionTypes)
        : questionTypes;

    // Extract text from file if uploaded
    let extractedText = "";
    if (req.file) {
      extractedText = await extractTextFromFile(
        req.file.path,
        req.file.mimetype
      );
    }

    const assignment = await Assignment.create({
      title,
      dueDate,
      questionTypes: parsedQuestionTypes,
      additionalInstructions: additionalInstructions || "",
      extractedText: extractedText || "",
      status: "pending",
    } as any);

    await assignmentQueue.add("generate-paper", {
      assignmentId: assignment!._id.toString(),
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE assignment
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await GeneratedPaper.findOneAndDelete({ assignmentId: req.params.id });
    await redisClient.del(`paper:${req.params.id}`);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET generated paper
router.get("/:id/paper", async (req: Request, res: Response) => {
  try {
    const cached = await redisClient.get(`paper:${req.params.id}`);
    if (cached) {
      res.json({ success: true, data: JSON.parse(cached), fromCache: true });
      return;
    }

    const paper = await GeneratedPaper.findOne({ assignmentId: req.params.id });
    if (!paper) {
      res
        .status(404)
        .json({ success: false, message: "Paper not generated yet" });
      return;
    }

    await redisClient.set(
      `paper:${req.params.id}`,
      JSON.stringify(paper),
      "EX",
      3600
    );

    res.json({ success: true, data: paper });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST regenerate paper
router.post("/:id/regenerate", async (req: Request, res: Response) => {
  try {
    await GeneratedPaper.findOneAndDelete({ assignmentId: req.params.id });
    await redisClient.del(`paper:${req.params.id}`);

    await Assignment.findByIdAndUpdate(req.params.id, {
      status: "pending",
    });

    await assignmentQueue.add("generate-paper", {
      assignmentId: req.params.id,
    });

    res.json({ success: true, message: "Regeneration started!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
