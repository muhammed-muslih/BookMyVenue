import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // server
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  //mongodb
  MONGO_URI: z.string().trim().min(1, "MONGO_URI is required"),

  //redis
  REDIS_URL: z.string().trim().min(1, "REDIS_URL is required"),
});

export const env = envSchema.parse(process.env);
