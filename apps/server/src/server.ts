import app from "./app";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import connectDB from "@/config/db";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(
      `Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`,
    );
  });
};

startServer();
