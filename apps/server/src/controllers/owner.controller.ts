import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/apiError";
import {
  getMyOwnerApplicationService,
  submitOwnerApplicationService,
} from "@/services/owner.service";

//POST /owner/applications
export const submitOwnerApplication = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError("Unauthorized", 401);
    }

    const application = await submitOwnerApplicationService(
      req.user._id.toString(),
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Owner application submitted.",
      data: application,
    });
  },
);

//GET /owner/applications/me
export const getMyOwnerApplication = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError("Unauthorized", 401);
    }

    const application = await getMyOwnerApplicationService(
      req.user._id.toString(),
    );

    res.status(200).json({
      success: true,
      data: application,
    });
  },
);
