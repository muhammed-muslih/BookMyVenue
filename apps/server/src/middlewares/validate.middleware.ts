import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { ApiError } from "@/utils/apiError";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return next(new ApiError(message, 400));
    }

    // Replace request values with parsed/transformed values
    req.body = (result.data as any).body;

    next();
  };
