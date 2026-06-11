import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "./logger";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: Number(env.SMTP_PORT) === 465, // true for 465, false for other ports

  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const verifyMailConnection = async () => {
  try {
    await transporter.verify();

    logger.info("SMTP connection established");
  } catch (error) {
    logger.error("SMTP connection failed");

    throw error;
  }
};
