import Router from "express";
import { validate } from "@/middlewares/validate.middleware";
import {
  sendOTP,
  verifyOTP,
  register,
  getCurrentUser,
  refreshToken,
  logout,
} from "@/controllers/auth.controller";
import {
  sendOtpSchema,
  verifyOtpSchema,
  registerValidationSchema,
} from "@/validators/auth.validator";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/send-otp", validate(sendOtpSchema), sendOTP);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOTP);
router.post("/register", validate(registerValidationSchema), register);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

export default router;
