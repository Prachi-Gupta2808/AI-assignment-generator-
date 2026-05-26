import express, { Request, Response } from "express";
import { assignmentQueue } from "../config/bullmq";
import redisClient from "../config/redis";
import Assignment from "../models/Assignment";
import GeneratedPaper from "../models/GeneratedPaper";

const router = express.Router();

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
      res.status(404).json({ success: false, message: "Assignment not found" });
      return;
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create assignment
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, dueDate, questionTypes, additionalInstructions } = req.body;

    // Validation
    if (!title || !dueDate || !questionTypes || questionTypes.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
      return;
    }

    // Create assignment
    const assignment = await Assignment.create({
      title,
      dueDate,
      questionTypes,
      additionalInstructions,
      status: "pending",
    });

    // Add to BullMQ queue
    await assignmentQueue.add("generate-paper", {
      assignmentId: assignment._id.toString(),
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE assignment
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await GeneratedPaper.findOneAndDelete({ assignmentId: req.params.id });
    res.json({ success: true, message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET generated paper by assignment id
router.get("/:id/paper", async (req: Request, res: Response) => {
  try {
    // Check Redis cache first
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

    // Cache it
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

export default router;
