import { z } from "zod";

enum OwnerApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

const createOwnerApplicationSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please provide a valid 10-digit phone number"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message cannot exceed 500 characters"),
});

export const createOwnerValidationSchema = z.object({
  body: createOwnerApplicationSchema,
});

export const getOwnerApplicationsSchema = z.object({
  query: z.object({
    status: z.enum(OwnerApplicationStatus).optional(),
  }),
});

export const reviewOwnerApplicationSchema = z.object({
  body: z
    .object({
      status: z.enum(["approved", "rejected"]),

      rejectionReason: z.string().trim().max(300).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.status === "rejected" && !data.rejectionReason) {
        ctx.addIssue({
          code: "custom",
          path: ["rejectionReason"],
          message: "Rejection reason is required",
        });
      }
    }),
});

export type CreateOwnerApplicationDTO = z.infer<
  typeof createOwnerApplicationSchema
>;
