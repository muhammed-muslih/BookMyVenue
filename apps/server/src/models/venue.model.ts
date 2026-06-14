import { Schema, model } from "mongoose";
import { IVenue } from "@/types/venue.types";
import { VenueCategory, VenueApprovalStatus } from "@bookmyvenue/types";

const venueSchema = new Schema<IVenue>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxLength: 150,
    },

    description: {
      type: String,
      required: true,
      maxlength: 3000,
    },

    category: {
      type: String,
      enum: Object.values(VenueCategory),
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    capacity: {
      min: {
        type: Number,
        required: true,
        min: 1,
      },

      max: {
        type: Number,
        required: true,
        min: 1,
      },
    },

    pricing: {
      basePrice: {
        type: Number,
        required: true,
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
        required: true,
      },

      email: {
        type: String,
        lowercase: true,
      },
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    approvalStatus: {
      type: String,
      enum: Object.values(VenueApprovalStatus),
      default: VenueApprovalStatus.PENDING,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

venueSchema.virtual("offerPrice").get(function () {
  return (
    this.pricing.basePrice -
    (this.pricing.basePrice * this.pricing.discountPercentage) / 100
  );
});

venueSchema.index({ owner: 1 });

venueSchema.index({ category: 1 });

venueSchema.index({ city: 1 });

venueSchema.index({ approvalStatus: 1 });

venueSchema.index({ city: 1, category: 1, approvalStatus: 1 });

export const Venue = model<IVenue>("Venue", venueSchema);
