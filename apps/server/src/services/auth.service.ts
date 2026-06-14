import {
  storeOTP,
  validateOtp,
  OTP_ERRORS,
  OTPVerificationResult,
} from "@/utils/otp.util";
import { logger } from "@/config/logger";
import { ApiError } from "@/utils/apiError";
import { sendOTPEmail } from "./email.service";
import { User, IUser } from "@/models/user.model";
import { isPhoneNumber } from "@/validators/auth.validator";
import {
  signJWT,
  signTempJWT,
  verifyTempJWT,
  signRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt.util";
import { type RegisterInput } from "@/validators/auth.validator";
import { type VerifyOtpResult } from "@/types/auth.types";
import { storeRefreshToken, getRefreshToken } from "./auth.redis.service";

export const sendOtpService = async (
  identifier: string,
  channel?: "sms" | "whatsapp" | "email",
): Promise<void> => {
  const otp = await storeOTP(identifier);

  await sendOTPEmail(identifier, otp);

  logger.info({ identifier }, "OTP sent successfully");
};

export const verifyOtpService = async (
  identifier: string,
  otp: string,
): Promise<VerifyOtpResult> => {
  const result = await validateOtp(identifier, otp);

  if (result !== OTPVerificationResult.SUCCESS) {
    const error = OTP_ERRORS[result];

    throw new ApiError(error.message, error.statusCode);
  }

  logger.info({ identifier }, "OTP verified successfully");

  //check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  //existing user -> login
  if (existingUser) {
    if (existingUser.isBlocked) {
      throw new ApiError(
        "Access to your account has been restricted. Please contact support for assistance.",
        403,
      );
    }

    let shouldSave = false;

    //if user exists + deleted -> Reactivate account
    if (existingUser.deletedAt) {
      existingUser.deletedAt = null;

      logger.info(
        { userId: existingUser._id },
        "User reactivated via OTP login",
      );

      shouldSave = true;
    }

    //mark identifier as verified if not already
    if (isPhoneNumber(identifier) && !existingUser.isPhoneVerified) {
      existingUser.isPhoneVerified = true;
      shouldSave = true;
    }

    if (!isPhoneNumber(identifier) && !existingUser.isEmailVerified) {
      existingUser.isEmailVerified = true;
      shouldSave = true;
    }

    if (shouldSave) {
      await existingUser.save();
    }

    const accessToken = signJWT({
      id: existingUser._id.toString(),
      roles: existingUser.roles,
      activeRole: existingUser.activeRole,
    });

    const refreshToken = signRefreshToken({ id: existingUser._id.toString() });
    await storeRefreshToken(existingUser._id.toString(), refreshToken);

    logger.info({ userId: existingUser._id }, "User logged in");
    return { status: "login", accessToken, refreshToken };
  }

  /*
   * new user -> issue tempToken.
   * tempToken proves OTP was verified and it's expires in 10 min.
   * frontend sends this tempToken to server for registration.
   */

  const tempToken = signTempJWT({ identifier, verified: true });

  logger.info({ identifier }, "New user — temp token issued");
  return { status: "register", tempToken };
};

export const registerService = async ({
  tempToken,
  firstName,
  lastName,
  dob,
  intent,
}: RegisterInput) => {
  const payload = verifyTempJWT(tempToken);

  if (!payload.verified) {
    throw new ApiError("Invalid or expired registration session.", 401);
  }

  const identifier = payload.identifier;

  const existingUser = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (existingUser) {
    throw new ApiError("Account already exists.", 409);
  }

  const userData: Partial<IUser> = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    roles: ["user"],
    activeRole: "user",
  };

  if (dob) {
    userData.dob = new Date(dob);
  }

  if (isPhoneNumber(identifier)) {
    userData.phone = identifier;
    userData.isPhoneVerified = true;
  } else {
    userData.email = identifier;
    userData.isEmailVerified = true;
  }

  const user = await User.create(userData);

  const accessToken = signJWT({
    id: user._id.toString(),
    roles: user.roles,
    activeRole: user.activeRole,
  });

  const refreshToken = signRefreshToken({ id: user._id.toString() });
  await storeRefreshToken(user._id.toString(), refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
    redirectToOwnerOnboarding: intent === "owner",
  };
};

export const getCurrentUserService = async (userId: string) => {
  const user = await User.findById(userId).select(
    " firstName lastName email avatar roles activeRole isEmailVerified ",
  );

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
};

export const refreshTokenService = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  const stored = await getRefreshToken(payload.id);

  if (!stored || stored !== refreshToken) {
    throw new ApiError("Invalid refresh token", 401);
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw new ApiError("User not found", 401);
  }

  const accessToken = signJWT({
    id: user._id.toString(),
    roles: user.roles,
    activeRole: user.activeRole,
  });

  return accessToken;
};
