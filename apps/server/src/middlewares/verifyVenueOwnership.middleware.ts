import { Request, Response, NextFunction } from "express";
import { Venue } from "@/models/venue.model";
import { ApiError } from "@/utils/apiError";

export const verifyVenueOwnership = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const id = req.params.id as string;

  if (!id) {
    throw new ApiError("Venue id is required", 400);
  }

  const venue = await Venue.findOne({ _id: id, deletedAt: null });

  if (!venue) {
    throw new ApiError("Venue not found.", 404);
  }

  if (venue.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError("You are not authorized to modify this venue.", 403);
  }

  next();
};
