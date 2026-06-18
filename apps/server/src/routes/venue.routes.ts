import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { authenticate } from "@/middlewares/auth.middleware";
import { verifyVenueOwnership } from "@/middlewares/verifyVenueOwnership.middleware";
import {
  createVenueValidationSchema,
  updateVenueValidationSchema,
} from "@/validators/venue.validator";
import {
  createVenue,
  getMyVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} from "@/controllers/venue.controller";

const router = Router();

//protected routes
router.post(
  "/",
  authenticate,
  authorize("owner"),
  validate(createVenueValidationSchema),
  createVenue,
);

router.get("/my-venues", authenticate, authorize("owner"), getMyVenues);

router.patch(
  "/:id",
  authenticate,
  authorize("owner"),
  verifyVenueOwnership,
  validate(updateVenueValidationSchema),
  updateVenue,
);

router.delete(
  "/:id",
  authenticate,
  authorize("owner"),
  verifyVenueOwnership,
  deleteVenue,
);

// public routes
router.get("/:id", getVenueById);

export default router;
