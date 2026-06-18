import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import {
  submitOwnerApplication,
  getMyOwnerApplication,
} from "@/controllers/owner.controller";
import { createOwnerValidationSchema } from "@/validators/owner.validator";

const router = Router();

router.post(
  "/applications",
  authenticate,
  authorize("user"),
  validate(createOwnerValidationSchema),
  submitOwnerApplication,
);

router.get(
  "/applications/me",
  authenticate,
  authorize("user"),
  getMyOwnerApplication,
);

export default router;
