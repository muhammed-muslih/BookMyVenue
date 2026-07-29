import { Schema, model } from "mongoose";
import { VenueCategory, VenueDraftStatus } from "@bookmyvenue/types";
import { IVenueDraft } from "@/types/venue.types";

const venueDraftSchema = new Schema<IVenueDraft>(
  {
    venue: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
      index: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    changes: {
      name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 150,
      },

      description: {
        type: String,
        maxlength: 3000,
      },

      category: {
        type: String,
        enum: Object.values(VenueCategory),
      },

      images: {
        type: [String],
      },

      amenities: {
        type: [String],
      },

      capacity: {
        min: {
          type: Number,
          min: 1,
        },

        max: {
          type: Number,
          min: 1,
        },
      },

      pricing: {
        basePrice: {
          type: Number,
          min: 0,
        },

        discountPercentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },

      contact: {
        phone: {
          type: String,
        },

        email: {
          type: String,
          lowercase: true,
        },
      },

      address: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },

      pincode: {
        type: String,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: Object.values(VenueDraftStatus),
      default: VenueDraftStatus.PENDING,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const VenueDraft = model<IVenueDraft>("VenueDraft", venueDraftSchema);
