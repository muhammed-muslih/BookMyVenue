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
  updateVenue,
  deleteVenue,
} from "@/controllers/venue.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("owner"));

//protected routes
router.post("/", validate(createVenueValidationSchema), createVenue);

router.get("/my-venues", getMyVenues);

router.patch(
  "/:id",
  verifyVenueOwnership,
  validate(updateVenueValidationSchema),
  updateVenue,
);

router.delete("/:id", verifyVenueOwnership, deleteVenue);

export default router;
