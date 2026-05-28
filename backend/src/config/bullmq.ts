import { Queue } from "bullmq";
import { connectionOptions } from "./redis";

export const assignmentQueue = new Queue("assignment-generation", {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  },
});

console.log("BullMQ Queue Ready!");
