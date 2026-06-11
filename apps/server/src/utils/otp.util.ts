import redis from "@/config/redis";
import { ApiError } from "./apiError";
import crypto from "crypto";

const OTP_TTL = 5 * 60; // 5 minutes
const REQUEST_ATTEMPT_TTL = 60 * 15; // 15 min
const MAX_OTP_REQUESTS = 3;
const MAX_VERIFY_ATTEMPTS = 5;

export enum OTPVerificationResult {
  SUCCESS = "SUCCESS",
  INVALID = "INVALID",
  EXPIRED = "EXPIRED",
  TOO_MANY_ATTEMPTS = "TOO_MANY_ATTEMPTS",
}

export const OTP_ERRORS: Record<
  Exclude<OTPVerificationResult, OTPVerificationResult.SUCCESS>,
  { message: string; statusCode: number }
> = {
  [OTPVerificationResult.INVALID]: {
    message: "Invalid OTP",
    statusCode: 400,
  },
  [OTPVerificationResult.EXPIRED]: {
    message: "OTP has expired.",
    statusCode: 400,
  },
  [OTPVerificationResult.TOO_MANY_ATTEMPTS]: {
    message: "Too many invalid OTP attempts.",
    statusCode: 429,
  },
};

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const storeOTP = async (identifier: string): Promise<string> => {
  const otpKey = `otp:${identifier}`;
  const requestAttemptsKey = `otp:attempts:${identifier}`;

  const requestAttempts = Number(await redis.get(requestAttemptsKey)) || 0;

  if (requestAttempts >= MAX_OTP_REQUESTS) {
    throw new ApiError("Too many OTP requests. Please try again later.", 429);
  }

  const otp = generateOTP();

  await redis.setex(otpKey, OTP_TTL, otp);

  const updatedAttempts = await redis.incr(requestAttemptsKey);

  if (updatedAttempts === 1) {
    await redis.expire(requestAttemptsKey, REQUEST_ATTEMPT_TTL);
  }

  return otp;
};

export const validateOtp = async (
  identifier: string,
  otp: string,
): Promise<OTPVerificationResult> => {
  const otpKey = `otp:${identifier}`;
  const requestAttemptsKey = `otp:attempts:${identifier}`;
  const verifyAttemptsKey = `otp:verify-attempts:${identifier}`;

  const verifyAttempts = Number(await redis.get(verifyAttemptsKey)) || 0;

  if (verifyAttempts >= MAX_VERIFY_ATTEMPTS) {
    return OTPVerificationResult.TOO_MANY_ATTEMPTS;
  }

  const storedOTP = await redis.get(otpKey);

  if (!storedOTP) {
    return OTPVerificationResult.EXPIRED;
  }

  if (storedOTP !== otp) {
    const updatedVerifyAttempts = await redis.incr(verifyAttemptsKey);

    if (updatedVerifyAttempts === 1) {
      await redis.expire(verifyAttemptsKey, OTP_TTL);
    }

    if (updatedVerifyAttempts >= MAX_VERIFY_ATTEMPTS) {
      await redis.del(otpKey, verifyAttemptsKey); // Invalidate OTP after too many failed attempts and reset attempts
      return OTPVerificationResult.TOO_MANY_ATTEMPTS;
    }
    return OTPVerificationResult.INVALID;
  }

  await redis.del(otpKey, verifyAttemptsKey, requestAttemptsKey); // Invalidate OTP and reset attempts on successful verification

  return OTPVerificationResult.SUCCESS;
};
