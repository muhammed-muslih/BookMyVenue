import { Schema, model, Types } from "mongoose";

export enum OwnerApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IOwnerApplication {
  userId: Types.ObjectId;

  phone: string;

  message: string;

  status: "pending" | "approved" | "rejected";

  reviewedBy?: Types.ObjectId;

  reviewedAt?: Date;

  rejectionReason?: string;

  resubmissionCount: number;
}

const ownerApplicationSchema = new Schema<IOwnerApplication>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(OwnerApplicationStatus),
      default: OwnerApplicationStatus.PENDING,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: Date,

    rejectionReason: String,

    resubmissionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const OwnerApplication = model<IOwnerApplication>(
  "OwnerApplication",
  ownerApplicationSchema,
);
