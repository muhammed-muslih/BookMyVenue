import { z } from "zod";
import { VenueCategory } from "@bookmyvenue/types";
import { updateCapacitySchema } from "./venue.validator";

export const updateVenueDraft = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),

    description: z.string().trim().min(10).max(2000).optional(),

    category: z.enum(VenueCategory).optional(),

    images: z.array(z.url()).optional(),

    amenities: z.array(z.string()).optional(),

    capacity: updateCapacitySchema.optional(),

    address: z.string().trim().optional(),

    city: z.string().trim().optional(),

    state: z.string().trim().optional(),

    pincode: z.string().trim().optional(),
  })
  .strict();

export const updateVenueDraftSchema = z.object({
  body: updateVenueDraft,
});

export type UpdateVenueDraftDTO = z.infer<typeof updateVenueDraft>;
