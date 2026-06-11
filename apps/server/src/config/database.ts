import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

const connectDB = async () => {
  if (!env.MONGO_URI) {
    logger.error("MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("Database connection established successfully.");
  } catch (error) {
    logger.error("Failed to connect MongoDB");

    throw error;
  }
};

export default connectDB;
