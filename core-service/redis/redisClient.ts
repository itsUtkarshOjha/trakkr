import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

const redisInit = async () => {
  if (!redisClient) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL || "redis://redis:6379",
      });

      redisClient.on("error", (err) => {
        console.error("Redis error:", err);
      });

      await redisClient.connect();
      console.log("Redis connection successful.");
    } catch (error) {
      console.error("Redis connection failed:", error);
      throw new Error("Something went wrong while connecting to Redis.");
    }
  }
  return redisClient;
};

export default redisInit;
