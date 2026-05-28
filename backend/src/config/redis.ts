import dotenv from "dotenv";
import IORedis from "ioredis";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const parsedUrl = new URL(redisUrl);

export const connectionOptions = {
  host: parsedUrl.hostname,
  port: Number(parsedUrl.port),
  password: parsedUrl.password,
  maxRetriesPerRequest: null,
};

const redisClient = new IORedis({
  ...connectionOptions,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("Redis Connected!"));

export const connectRedis = async (): Promise<void> => {
  console.log("Redis initializing...");
};

export default redisClient;
