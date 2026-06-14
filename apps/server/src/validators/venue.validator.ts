import { z } from "zod";
import { VenueCategory } from "@bookmyvenue/types";

const capacitySchema = z
  .object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  })
  .refine((data) => data.max >= data.min, {
    message:
      "Maximum capacity must be greater than or equal to minimum capacity.",
    path: ["max"],
  });

const pricingSchema = z.object({
  basePrice: z.number().nonnegative(),
  discountPercentage: z.number().min(0).max(100).default(0),
});

const contactSchema = z.object({
  phone: z.string().trim().min(10).max(15),

  email: z.email().optional(),
});

export const createVenueSchema = z.object({
  name: z.string().trim().min(3).max(150),

  description: z.string().trim().min(20).max(3000),

  category: z.enum(VenueCategory),

  images: z.array(z.url()).default([]),

  amenities: z.array(z.string()).default([]),

  capacity: capacitySchema,

  pricing: pricingSchema,

  contact: contactSchema,

  address: z.string().trim().min(5),

  city: z.string().trim().min(2),

  state: z.string().trim().min(2),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});

export const createVenueValidationSchema = z.object({
  body: createVenueSchema,
});

export const updateCapacitySchema = z
  .object({
    min: z.number().int().positive().optional(),
    max: z.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.min === undefined || data.max === undefined || data.min <= data.max,
    {
      message:
        "Maximum capacity must be greater than or equal to minimum capacity.",
      path: ["max"],
    },
  );

const updatePricingSchema = pricingSchema.partial();

const updateContactSchema = contactSchema.partial();

export const updateVenueSchema = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),

    description: z.string().trim().min(10).max(2000).optional(),

    category: z.enum(VenueCategory).optional(),

    images: z.array(z.url()).optional(),

    amenities: z.array(z.string()).optional(),

    capacity: updateCapacitySchema.optional(),

    pricing: updatePricingSchema.optional(),

    contact: updateContactSchema.optional(),

    address: z.string().trim().optional(),

    city: z.string().trim().optional(),

    state: z.string().trim().optional(),

    pincode: z.string().trim().optional(),
  })
  .strict();

export const updateVenueValidationSchema = z.object({
  body: updateVenueSchema,
});

export type CreateVenueDTO = z.infer<typeof createVenueSchema>;

export type UpdateVenueDTO = z.infer<typeof updateVenueSchema>;
