import { CreateOwnerApplicationDTO } from "@/validators/owner.validator";
import { OwnerApplication } from "@/models/owner-application.model";
import { ApiError } from "@/utils/apiError";

export const submitOwnerApplicationService = async (
  userId: string,
  payload: CreateOwnerApplicationDTO,
) => {
  const existingApplication = await OwnerApplication.findOne({ userId });

  if (!existingApplication) {
    return OwnerApplication.create({
      userId,
      phone: payload.phone,
      message: payload.message,
    });
  }

  if (existingApplication.status === "pending") {
    throw new ApiError("You already have a pending owner application", 400);
  }

  if (existingApplication.status === "approved") {
    throw new ApiError("You are already an approved owner", 400);
  }

  existingApplication.phone = payload.phone;
  existingApplication.message = payload.message;

  existingApplication.status = "pending";

  existingApplication.resubmissionCount += 1;
  existingApplication.reviewedBy = undefined;
  existingApplication.reviewedAt = undefined;

  await existingApplication.save();

  return existingApplication;
};

export const getMyOwnerApplicationService = async (userId: string) => {
  return OwnerApplication.findOne({ userId });
};
