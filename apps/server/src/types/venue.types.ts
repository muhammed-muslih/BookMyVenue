import { Types, HydratedDocument } from "mongoose";
import {
  VenueCategory,
  VenueApprovalStatus,
  VenueDraftStatus,
} from "@bookmyvenue/types";

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
  rejectionReason: string | null;
  approvedAt: Date | null;
  approvedBy: Types.ObjectId | null;

  resubmissionCount: number;

  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export type VenueDocument = HydratedDocument<IVenue>;

export interface IVenueDraftChanges {
  name?: string;

  description?: string;

  category?: VenueCategory;

  images?: string[];

  amenities?: string[];

  capacity?: {
    min: number;
    max: number;
  };

  address?: string;

  city?: string;

  state?: string;

  pincode?: string;
}

export interface IVenueDraft {
  venue: Types.ObjectId;

  owner: Types.ObjectId;

  changes: IVenueDraftChanges;

  status: VenueDraftStatus;

  rejectionReason: string | null;

  reviewedBy: Types.ObjectId | null;

  reviewedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type VenueDraftDocument = HydratedDocument<IVenueDraft>;
