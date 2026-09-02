import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { PaymentProvider, PaymentStatus, PaymentType } from "@/types";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  idempotencyKey: string;
  type: PaymentType;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  dueDate?: Date;
  paidAt?: Date;
  failureReason?: string;
  safeProviderMetadata?: Record<string, string>;
  webhookProcessed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    provider: { type: String, enum: ["paypal", "square", "manual"], required: true },
    providerOrderId: String,
    providerPaymentId: String,
    idempotencyKey: { type: String, required: true, unique: true },
    type: { type: String, enum: ["deposit", "installment", "full", "balance"], required: true },
    amountCents: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "processing", "completed", "failed", "refunded", "cancelled"], default: "pending" },
    dueDate: Date,
    paidAt: Date,
    failureReason: String,
    safeProviderMetadata: Schema.Types.Mixed,
    webhookProcessed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PaymentSchema.index({ providerPaymentId: 1 });
PaymentSchema.index({ bookingId: 1 });

export const Payment: Model<IPayment> = mongoose.models.Payment ?? mongoose.model<IPayment>("Payment", PaymentSchema);
