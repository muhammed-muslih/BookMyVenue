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

  //jwt
  JWT_SECRET: z
    .string()
    .trim()
    .min(32, "JWT_SECRET must be at least 32 characters for security"),

  JWT_EXPIRES_IN: z.string().default("7d"),

  JWT_TEMP_SECRET: z
    .string()
    .trim()
    .min(32, "JWT_TEMP_SECRET must be at least 32 characters for security"),

  JWT_TEMP_EXPIRES_IN: z.string().default("10m"),

  JWT_REFRESH_SECRET: z
    .string()
    .trim()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters for security"),

  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  SMTP_HOST: z.string(),

  SMTP_PORT: z.string().default("587"),

  SMTP_USER: z.email(),

  SMTP_PASS: z.string(),

  SMTP_FROM: z.string().default("BookMyVenue <noreply@bookmyvenue.in>"),

  ADMIN_EMAIL: z.email(),
});

export const env = envSchema.parse(process.env);
