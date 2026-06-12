import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/apiError";
import { UserRole } from "@bookmyvenue/types";

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError("Authentication required.", 401);
    }

    if (!allowedRoles.includes(req.user.activeRole)) {
      throw new ApiError(
        "You do not have permission to perform this action.",
        403,
      );
    }

    next();
  };
