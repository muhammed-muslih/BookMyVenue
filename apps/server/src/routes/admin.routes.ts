import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  getOwnerApplications,
  reviewOwnerApplication,
} from "@/controllers/admin.controller";
import {
  getOwnerApplicationsSchema,
  reviewOwnerApplicationSchema,
} from "@/validators/owner.validator";

const router = Router();

router.get(
  "/owner-applications",
  authenticate,
  authorize("admin"),
  validate(getOwnerApplicationsSchema),
  getOwnerApplications,
);

router.patch(
  "/owner-applications/:id/review",
  authenticate,
  authorize("admin"),
  validate(reviewOwnerApplicationSchema),
  reviewOwnerApplication,
);
export default router;
