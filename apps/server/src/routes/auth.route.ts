import Router from "express";
import { validate } from "@/middlewares/validate.middleware";
import { sendOTP, verifyOTP, register } from "@/controllers/auth.controller";
import {
  sendOtpSchema,
  verifyOtpSchema,
  registerValidationSchema,
} from "@/validators/auth.validator";
const router = Router();

router.post("/send-otp", validate(sendOtpSchema), sendOTP);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOTP);
router.post("/register", validate(registerValidationSchema), register);

export default router;
