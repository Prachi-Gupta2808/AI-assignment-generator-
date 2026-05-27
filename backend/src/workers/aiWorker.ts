import { Job, Worker } from "bullmq";
import redisClient, { connectionOptions } from "../config/redis";
import Assignment from "../models/Assignment";
import GeneratedPaper from "../models/GeneratedPaper";
import { generateQuestionPaper } from "../services/aiService";
import { notifyClient } from "../websocket/socket";

export const startWorker = () => {
  const worker = new Worker(
    "assignment-generation",
    async (job: Job) => {
      const { assignmentId } = job.data;
      console.log(`Processing job for assignment: ${assignmentId}`);

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "processing",
      });

      notifyClient(assignmentId, {
        status: "processing",
        message: "Generating your question paper...",
      });

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error(`Assignment ${assignmentId} not found`);

      const paper = await generateQuestionPaper(
        assignment.title,
        assignment.questionTypes,
        assignment.additionalInstructions,
        assignment.extractedText
      );

      const generatedPaper = await GeneratedPaper.create({
        assignmentId: assignment._id,
        sections: paper.sections,
        totalMarks: paper.totalMarks,
        totalQuestions: paper.totalQuestions,
        subject: paper.subject,
        schoolName: paper.schoolName,
        className: paper.className,
        timeAllowed: paper.timeAllowed,
        aiMessage: paper.aiMessage,
      });

      await redisClient.set(
        `paper:${assignmentId}`,
        JSON.stringify(generatedPaper),
        "EX",
        3600
      );

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
      });

      notifyClient(assignmentId, {
        status: "completed",
        message: "Question paper generated!",
        paperId: generatedPaper._id.toString(),
        assignmentId,
      });

      console.log(`Job completed for assignment: ${assignmentId}`);
      return { assignmentId, paperId: generatedPaper._id.toString() };
    },
    { connection: connectionOptions }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed!`);
  });

  worker.on("failed", async (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
    if (job?.data.assignmentId) {
      await Assignment.findByIdAndUpdate(job.data.assignmentId, {
        status: "failed",
      });
      notifyClient(job.data.assignmentId, {
        status: "failed",
        message: "Generation failed. Please try again.",
      });
    }
  });

  console.log("BullMQ Worker started!");
  return worker;
};
