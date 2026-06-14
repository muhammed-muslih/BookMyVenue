import { Types } from "mongoose";
import { VenueCategory, VenueApprovalStatus } from "@bookmyvenue/types";

export interface IVenue {
  owner: Types.ObjectId;

  name: string;
  description: string;

  category: VenueCategory;

  images: string[];

  amenities: string[];

  capacity: {
    min: number;
    max: number;
  };

  pricing: {
    basePrice: number;
    discountPercentage: number;
  };

  contact: {
    phone: string;
    email?: string;
  };

  address: string;
  city: string;
  state: string;
  pincode: string;

  approvalStatus: VenueApprovalStatus;

  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
