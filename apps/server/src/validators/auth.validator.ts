import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

const emailSchema = z.email("Invalid email address").trim().toLowerCase();
const phoneSchema = z.string().trim().regex(phoneRegex, "Invalid phone number");

//identifier can be either email or phone
const identifierSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase())
  .refine(
    (value) =>
      emailSchema.safeParse(value).success ||
      phoneSchema.safeParse(value).success,
    {
      message: "Identifier must be a valid email or 10-digit phone number",
    },
  );

export const sendOtpSchema = z.object({
  body: z.object({
    identifier: emailSchema,
    channel: z.enum(["sms", "whatsapp", "email"]).optional(),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    identifier: emailSchema,
    otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  }),
});

// checks if identifier is a phone number
export const isPhoneNumber = (identifier: string): boolean =>
  /^\+?[0-9]{10,15}$/.test(identifier.replace(/\s/g, ""));

//for the registration end point
export const registerSchema = z.object({
  tempToken: z.string().trim().min(1, "Registration token is required"),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),

  dob: z.coerce
    .date({
      message: "Invalid date format",
    })
    .refine(
      (date) => new Date(date) < new Date(),
      "Date of birth cannot be in the future",
    )
    .refine((date) => {
      const age =
        (Date.now() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25);

      return age >= 13;
    }, "You must be at least 13 years old"),

  intent: z.enum(["user", "owner"]).optional(),
});

export const registerValidationSchema = z.object({
  body: registerSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
