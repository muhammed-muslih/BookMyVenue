import { transporter } from "@/config/mail";
import { env } from "@/config/env";
import { generateOTPTemplate } from "@/templates/otp.template";
import { logger } from "@config/logger";

export const sendOTPEmail = async (
  identifier: string,
  otp: string,
): Promise<void> => {
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: identifier,
    subject: "Your OTP for BookMyVenue",
    html: generateOTPTemplate(otp),
  });
};
