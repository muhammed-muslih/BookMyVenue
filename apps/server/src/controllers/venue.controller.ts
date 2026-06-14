import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createVenueService,
  getOwnerVenuesService,
  getVenueByIdService,
  updateVenueService,
  deleteVenueService,
} from "@/services/venue.service";
import { ApiError } from "@/utils/apiError";

//POST /venues
export const createVenue = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError("Unauthorized", 401);
  }
  const venue = await createVenueService(req.user._id.toString(), req.body);

  res.status(201).json({
    success: true,
    message: "Venue created successfully.",
    data: venue,
  });
});

//GET /my-venues?page=1&limit=10
export const getMyVenues = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError("Unauthorized", 401);
  }

  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const result = await getOwnerVenuesService(
    req.user._id.toString(),
    page,
    limit,
  );

  res.status(200).json({
    success: true,
    message: "Venues fetched successfully.",
    data: result,
  });
});

//GET /venues/:id
export const getVenueById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const venue = await getVenueByIdService(id);

    res.status(200).json({
      success: true,
      message: "Venue fetched successfully.",
      data: venue,
    });
  },
);

//PATCH /venues/:id
export const updateVenue = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const venue = await updateVenueService(id, req.body);

  res.status(200).json({
    success: true,
    message: "Venue updated successfully.",
    data: venue,
  });
});

//DELETE /venues/:id
export const deleteVenue = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await deleteVenueService(id);

  res.status(200).json({
    success: true,
    message: "Venue deleted successfully.",
  });
});
