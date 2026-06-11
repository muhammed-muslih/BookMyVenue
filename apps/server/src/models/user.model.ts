import { Schema, model } from "mongoose";

export type UserRole = "user" | "owner" | "admin";

export interface IUser {
  firstName: string;
  lastName: string;

  email?: string;
  phone?: string;
  googleId?: string;

  avatar?: string;
  dob: Date;

  roles: UserRole[];
  activeRole: UserRole;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBlocked: boolean;

  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
    },

    dob: {
      type: Date,
      required: true,
    },

    roles: {
      type: [String],
      enum: ["user", "owner", "admin"],
      default: ["user"],
    },

    activeRole: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.index({ roles: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ deletedAt: 1 });

export const User = model<IUser>("User", userSchema);
