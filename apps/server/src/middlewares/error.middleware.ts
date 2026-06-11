import { Response, Request, NextFunction } from "express";
import { ApiError } from "@/utils/apiError";
import { logger } from "@/config/logger";
import { env } from "@/config/env";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isOperational = err instanceof ApiError && err.isOperational;

  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  const status = err instanceof ApiError ? err.status : "error";

  const message = isOperational ? err.message : "Internal Server Error";

  // Log unexpected/programming errors
  if (!isOperational) {
    logger.error(err);
  }

  res.status(statusCode).json({
    success: "false",
    status,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
