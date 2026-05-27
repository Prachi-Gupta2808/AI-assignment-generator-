import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import "./config/bullmq";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import assignmentRoutes from "./routes/assignment";
import { initWebSocket } from "./websocket/socket";
import { startWorker } from "./workers/aiWorker";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();
connectRedis();

startWorker();

app.use("/api/assignments", assignmentRoutes);

app.get("/", (req, res) => {
  res.send("VedaAI Backend Running!");
});

const server = http.createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
