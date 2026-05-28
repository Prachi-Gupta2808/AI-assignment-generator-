import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import http from "http";
import "./config/bullmq";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import assignmentRoutes from "./routes/assignment";
import { initWebSocket } from "./websocket/socket";
import { startWorker } from "./workers/aiWorker";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-assignment-generator-roan.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

connectDB();
connectRedis();

startWorker();

// General rate limit - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please slow down!" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for AI (I have free tier :( - 10 per minute
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many AI generations, please wait a minute!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", generalLimiter);
app.use("/api/assignments", aiLimiter);

app.use("/api/assignments", assignmentRoutes);

app.get("/", (req, res) => {
  res.send("VedaAI Backend Running!");
});

const server = http.createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
