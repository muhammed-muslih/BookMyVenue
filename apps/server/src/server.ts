import app from "./app";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import connectDB from "@/config/database";
import { connectRedis } from "@config/redis";
import { verifyMailConnection } from "@config/mail";

const startServer = async () => {
  try {
    await connectDB();

    await connectRedis();

    await verifyMailConnection();

    app.listen(env.PORT, () => {
      logger.info(
        `Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`,
      );
    });
  } catch (error) {
    logger.fatal({ err: error }, "Server startup failed");

    process.exit(1);
  }
};

startServer();
