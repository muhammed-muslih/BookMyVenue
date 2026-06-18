import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  getOwnerApplicationsService,
  reviewOwnerApplicationService,
} from "@/services/admin.service";
import { OwnerApplicationStatus } from "@/models/owner-application.model";
import { ApiError } from "@/utils/apiError";

// GET /admin/owner-applications?status=rejected/approved
export const getOwnerApplications = asyncHandler(
  async (req: Request, res: Response) => {
    const status = req.query.status as OwnerApplicationStatus | undefined;

    const applications = await getOwnerApplicationsService(status);

    res.status(200).json({
      success: true,
      data: applications,
    });
  },
);

// PATCH /admin/owner-applications/:id/review
export const reviewOwnerApplication = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError("Unauthorized", 401);
    }

    const adminId = req.user?._id.toString();
    const applicationId = req.params.id as string;

    const application = await reviewOwnerApplicationService(
      applicationId,
      adminId,
      req.body?.status,
      req.body?.rejectionReason,
    );

    res.status(200).json({
      success: true,
      data: application,
    });
  },
);
