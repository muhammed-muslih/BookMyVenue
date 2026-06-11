import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/apiError";
import { verifyJWT } from "@/utils/jwt.util";
import { User } from "@/models/user.model";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError("Authentication required.", 401);
  }

  let payload;

  try {
    payload = verifyJWT(token);
  } catch {
    throw new ApiError("Invalid or expired token.", 401);
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw new ApiError("User not found.", 401);
  }

  if (user.isBlocked) {
    throw new ApiError("Account suspended.", 403);
  }

  if (user.deletedAt) {
    throw new ApiError("Account deactivated.", 403);
  }

  req.user = user;

  next();
};
