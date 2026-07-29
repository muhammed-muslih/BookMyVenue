import { Venue } from "@/models/venue.model";
import { CreateVenueDTO, UpdateVenueDTO } from "@/validators/venue.validator";
import { ApiError } from "@/utils/apiError";
import { Types } from "mongoose";
import { VenueDocument } from "@/types/venue.types";
import { upsertVenueDraft } from "./venueDraft.service";
import { VenueApprovalStatus } from "@bookmyvenue/types";
import { applyVenueChanges } from "@/helpers/venue.helper";

export const createVenueService = async (
  ownerId: string,
  payload: CreateVenueDTO,
) => {
  const existingVenue = await Venue.findOne({
    owner: ownerId,
    name: payload.name,
    address: payload.address,
    city: payload.city,
    deletedAt: null,
  });

  if (existingVenue) {
    throw new ApiError("A venue already exists at this name and address.", 409);
  }

  const venue = await Venue.create({
    ...payload,
    owner: new Types.ObjectId(ownerId),
  });

  return venue;
};

export const getVenueByIdService = async (venueId: string) => {
  const venue = await Venue.findOne({ _id: venueId, deletedAt: null }).lean();
  console.log(venue);

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
  venue: VenueDocument,
  payload: UpdateVenueDTO,
) => {
  if (venue.approvalStatus === VenueApprovalStatus.APPROVED) {
    const draft = await upsertVenueDraft(venue, payload);

    return {
      message: "Venue changes submitted for approval.",
      draft,
    };
  }

  if (venue.approvalStatus === VenueApprovalStatus.REJECTED) {
    applyVenueChanges(venue, payload);

    venue.approvalStatus = VenueApprovalStatus.PENDING;
    venue.rejectionReason = null;
    venue.resubmissionCount += 1;

    await venue.save();

    return {
      message: "Venue resubmitted for review.",
      venue,
    };
  }

  if (venue.approvalStatus === VenueApprovalStatus.PENDING) {
    applyVenueChanges(venue, payload);

    await venue.save();

    return {
      message: "Venue updated successfully.",
      venue,
    };
  }

  throw new ApiError("This venue cannot be updated in its current state.", 403);
};

export const deleteVenueService = async (venueId: string) => {
  const venue = await Venue.findOne({ _id: venueId, deletedAt: null });

  if (!venue) {
    throw new ApiError("Venue not found.", 404);
  }

  venue.deletedAt = new Date();
  await venue.save();
};
