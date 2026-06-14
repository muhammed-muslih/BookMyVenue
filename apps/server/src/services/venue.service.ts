import { Venue } from "@/models/venue.model";
import { CreateVenueDTO, UpdateVenueDTO } from "@/validators/venue.validator";
import { ApiError } from "@/utils/apiError";
import { Types } from "mongoose";
import { flattenObject } from "@/utils/flattenObject";

export const createVenueService = async (
  ownerId: string,
  payload: CreateVenueDTO,
) => {
  const existingVenue = await Venue.findOne({
    owner: ownerId,
    address: payload.address,
    city: payload.city,
    deletedAt: null,
  });

  if (existingVenue) {
    throw new ApiError("A venue already exists at this address.", 409);
  }

  const venue = await Venue.create({
    ...payload,
    owner: new Types.ObjectId(ownerId),
  });

  return venue;
};

export const getVenueByIdService = async (venueId: string) => {
  const venue = await Venue.findOne({ _id: venueId, deletedAt: null }).lean();

  if (!venue) {
    throw new ApiError("Venue not found.", 404);
  }

  if (venue.approvalStatus !== "approved") {
    throw new ApiError("Venue not found.", 404);
  }

  return venue;
};

export const getOwnerVenuesService = async (
  ownerId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    Venue.find({ owner: ownerId, deletedAt: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Venue.countDocuments({ owner: ownerId }),
  ]);

  return { venues, total, page, totalPage: Math.ceil(total / limit) };
};

export const updateVenueService = async (
  venueId: string,
  payload: UpdateVenueDTO,
) => {
  const updateData = flattenObject(payload);

  const venue = await Venue.findOneAndUpdate(
    { _id: venueId, deletedAt: null },
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!venue) {
    throw new ApiError("Venue not found.", 404);
  }

  return venue;
};

export const deleteVenueService = async (venueId: string) => {
  const venue = await Venue.findOne({ _id: venueId, deletedAt: null });

  if (!venue) {
    throw new ApiError("Venue not found.", 404);
  }

  venue.deletedAt = new Date();
  await venue.save();
};
