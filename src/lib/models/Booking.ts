import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { BookingStatus, PaymentChoice } from "@/types";

export interface ITraveler {
  legalName: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  pronouns?: string;
  dietaryRequirements?: string;
  accessibilityRequirements?: string;
  travelNotes?: string;
}

export interface IBooking extends Document {
  bookingReference: string;
  tripId: mongoose.Types.ObjectId;
  primaryTraveler: ITraveler & { email: string; phone: string };
  additionalTravelers: ITraveler[];
  emergencyContact: { name: string; relationship: string; phone: string };
  mailingAddress: { street: string; city: string; state: string; zip: string; country: string };
  roomOption?: { id: string; name: string; supplementCents: number };
  selectedExcursions: { id: string; name: string; priceCents: number }[];
  travelerCount: number;
  subtotalCents: number;
  saleDiscountCents: number;
  payInFullDiscountCents: number;
  promoDiscountCents: number;
  totalCents: number;
  amountPaidCents: number;
  balanceCents: number;
  currency: string;
  paymentChoice: PaymentChoice;
  promoCodeId?: mongoose.Types.ObjectId;
  bookingStatus: BookingStatus;
  paymentStatus: string;
  termsAcceptedAt?: Date;
  cancellationPolicyAcceptedAt?: Date;
  newsletterConsent: boolean;
  securePortalTokenHash: string;
  internalNotes?: string;
  roomPreference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: { type: String, required: true, unique: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    primaryTraveler: {
      legalName: String,
      preferredName: String,
      email: String,
      phone: String,
      pronouns: String,
      dietaryRequirements: String,
      accessibilityRequirements: String,
      travelNotes: String,
    },
    additionalTravelers: [{
      legalName: String,
      preferredName: String,
      pronouns: String,
      dietaryRequirements: String,
      accessibilityRequirements: String,
      travelNotes: String,
    }],
    emergencyContact: { name: String, relationship: String, phone: String },
    mailingAddress: { street: String, city: String, state: String, zip: String, country: String },
    roomOption: { id: String, name: String, supplementCents: Number },
    selectedExcursions: [{ id: String, name: String, priceCents: Number }],
    travelerCount: { type: Number, required: true },
    subtotalCents: { type: Number, required: true },
    saleDiscountCents: { type: Number, default: 0 },
    payInFullDiscountCents: { type: Number, default: 0 },
    promoDiscountCents: { type: Number, default: 0 },
    totalCents: { type: Number, required: true },
    amountPaidCents: { type: Number, default: 0 },
    balanceCents: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    paymentChoice: { type: String, enum: ["deposit", "full", "payment_plan"] },
    promoCodeId: { type: Schema.Types.ObjectId, ref: "PromoCode" },
    bookingStatus: {
      type: String,
      enum: ["pending_payment", "deposit_paid", "payment_plan_active", "paid_in_full", "payment_overdue", "confirmed", "waitlisted", "cancelled", "refunded"],
      default: "pending_payment",
    },
    paymentStatus: { type: String, default: "pending" },
    termsAcceptedAt: Date,
    cancellationPolicyAcceptedAt: Date,
    newsletterConsent: { type: Boolean, default: false },
    securePortalTokenHash: { type: String, required: true },
    internalNotes: String,
    roomPreference: String,
  },
  { timestamps: true }
);

BookingSchema.index({ bookingReference: 1 });
BookingSchema.index({ "primaryTraveler.email": 1 });
BookingSchema.index({ tripId: 1, bookingStatus: 1 });

export const Booking: Model<IBooking> = mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);
