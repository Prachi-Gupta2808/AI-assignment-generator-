import { Queue } from "bullmq";
import { connectionOptions } from "./redis";

export const assignmentQueue = new Queue("assignment-generation", {
  connection: connectionOptions,
});

console.log("BullMQ Queue Ready!");
