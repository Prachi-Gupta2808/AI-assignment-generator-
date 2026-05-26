import dotenv from "dotenv";
import IORedis from "ioredis";

dotenv.config();

export const connectionOptions = {
  host: "freehand-mountain-collar-23803.db.redis.io",
  port: 19419,
  password: "Hl9dxq1qk43VCPccKPclh6iztBQJhhSF",
  maxRetriesPerRequest: null,
};

const redisClient = new IORedis({
  host: "freehand-mountain-collar-23803.db.redis.io",
  port: 19419,
  password: "Hl9dxq1qk43VCPccKPclh6iztBQJhhSF",
  maxRetriesPerRequest: null,
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
