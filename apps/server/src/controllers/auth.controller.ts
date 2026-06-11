import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  sendOtpService,
  verifyOtpService,
  registerService,
} from "@/services/auth.service";
import { env } from "@/config/env";
import { ApiError } from "@/utils/apiError";

// POST /auth/send-otp
export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, channel } = req.body;

  await sendOtpService(identifier, channel);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    expiresIn: 300,
  });
});

// POST /auth/verify-otp
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, otp } = req.body;

  const result = await verifyOtpService(identifier, otp);

  if (result.status === "login") {
    // existing user — send token, frontend redirects to dashboard

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      status: "login",
      message: "Login successful",
    });
    return;
  }

  // new user — send tempToken, frontend shows profile form
  res.status(200).json({
    success: true,
    status: "register",
    tempToken: result.tempToken,
    message: "OTP verified. Please complete your profile.",
  });
});

// POST /auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerService(req.body);

  res
    .cookie("accessToken", result.token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .status(201)
    .json({
      success: true,
      message: "Account created successfully.",
      user: result.user,
      nextStep: result.redirectToOwnerOnboarding
        ? "owner_onboarding"
        : "dashboard",
    });
});

// GET /auth/me
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError("Unauthorized", 401);
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user._id.toString(),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        roles: req.user.roles,
        activeRole: req.user.activeRole,
        avatar: req.user.avatar,
        isEmailVerified: req.user.isEmailVerified,
        isPhoneVerified: req.user.isPhoneVerified,
      },
    });
  },
);
