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

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://ai-assignment-generator-roan.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

connectDB();
connectRedis();
startWorker();

// General rate limit — 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, please slow down!" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for AI — 10 per minute (free tier)
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy!" });
});

const server = http.createServer(app);

server.on("upgrade", (request, socket, head) => {
  const origin = request.headers.origin;

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`WebSocket upgrade blocked for origin: ${origin}`);
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }

  console.log(`WebSocket upgrade allowed for origin: ${origin}`);
});

initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
