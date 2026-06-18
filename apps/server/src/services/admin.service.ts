import {
  OwnerApplication,
  OwnerApplicationStatus,
} from "@/models/owner-application.model";
import { ApiError } from "@/utils/apiError";
import { Types } from "mongoose";
import { User } from "@/models/user.model";

export const getOwnerApplicationsService = async (
  status?: OwnerApplicationStatus,
) => {
  const filter = status ? { status } : {};

  return OwnerApplication.find(filter)
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const reviewOwnerApplicationService = async (
  applicationId: string,
  adminId: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
) => {
  const application = await OwnerApplication.findById(applicationId);

  if (!application) {
    throw new ApiError("Application not found", 404);
  }

  if (application.status === "approved") {
    throw new ApiError("Application has already been approved", 400);
  }

  if (status === "rejected" && !rejectionReason) {
    throw new ApiError("Rejection reason is required", 400);
  }

  application.status = status;
  application.reviewedBy = new Types.ObjectId(adminId);
  application.reviewedAt = new Date();

  if (status === "rejected") {
    application.rejectionReason = rejectionReason;
  } else {
    application.rejectionReason = undefined;

    //give the owner role tag
    const user = await User.findById(application.userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (!user.roles.includes("owner")) {
      user.roles.push("owner");
    }

    await user.save();
  }

  await application.save();

  return application;
};
