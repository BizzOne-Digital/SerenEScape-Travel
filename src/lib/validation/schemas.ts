import { z } from "zod";

export const travelerSchema = z.object({
  legalName: z.string().min(2, "Legal name is required"),
  preferredName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10),
  pronouns: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  accessibilityRequirements: z.string().optional(),
  travelNotes: z.string().optional(),
});

export const bookingStep1Schema = z.object({
  tripSlug: z.string().min(1),
  travelerCount: z.number().int().min(1).max(20),
  roomOptionId: z.string().optional(),
  excursionIds: z.array(z.string()).optional(),
});

export const bookingStep2Schema = z.object({
  primaryTraveler: travelerSchema,
  additionalTravelers: z.array(travelerSchema.omit({ email: true, phone: true })).optional(),
  mailingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
  emergencyContact: z.object({
    name: z.string().min(2),
    relationship: z.string().min(1),
    phone: z.string().min(10),
  }),
  roomPreference: z.string().optional(),
});

export const bookingStep3Schema = z.object({
  paymentChoice: z.enum(["deposit", "full", "payment_plan"]),
});

export const promoCodeSchema = z.object({
  code: z.string().min(2).max(50),
  tripSlug: z.string().optional(),
  email: z.string().email().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.enum([
    "general",
    "trip_inquiry",
    "booking_support",
    "payment",
    "custom_group",
    "partnership",
  ]),
  message: z.string().min(10),
  tripSlug: z.string().optional(),
});

export const customGroupSchema = z.object({
  organizationName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  destination: z.string().optional(),
  groupSize: z.number().int().min(2).optional(),
  preferredDates: z.string().optional(),
  budget: z.string().optional(),
  accommodation: z.string().optional(),
  activities: z.string().optional(),
  accessibility: z.string().optional(),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
