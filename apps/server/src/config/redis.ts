import Redis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

const isTLS =
  env.NODE_ENV === "production" || env.REDIS_URL.startsWith("rediss://");

const redis = new Redis(env.REDIS_URL, {
  tls: isTLS ? {} : undefined,

  retryStrategy: (times) => {
    if (times > 5) return null;

    return Math.min(times * 200, 2000);
  },

  maxRetriesPerRequest: 3,

  lazyConnect: true,
});

export const connectRedis = async () => {
  try {
    await redis.connect();

    logger.info("Redis connected successfully.");
  } catch (error) {
    logger.error("Failed to connect Redis");

    throw error;
  }
};

redis.on("error", (error) => {
  logger.error({ error }, "Redis error");
});

// graceful shutdown
process.on("SIGINT", async () => {
  await redis.quit();

  logger.info("Redis disconnected");

  process.exit(0);
});

export default redis;
