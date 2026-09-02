import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { InstallmentStatus } from "@/types";

export interface IPaymentInstallment extends Document {
  bookingId: mongoose.Types.ObjectId;
  sequence: number;
  label: string;
  amountCents: number;
  dueDate: Date;
  status: InstallmentStatus;
  paymentId?: mongoose.Types.ObjectId;
  remindersSent: { type: string; sentAt: Date }[];
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentInstallmentSchema = new Schema<IPaymentInstallment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    sequence: { type: Number, required: true },
    label: { type: String, required: true },
    amountCents: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "paid", "overdue", "waived", "cancelled"], default: "pending" },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    remindersSent: [{ type: { type: String }, sentAt: Date }],
    paidAt: Date,
  },
  { timestamps: true }
);

PaymentInstallmentSchema.index({ bookingId: 1, sequence: 1 });
PaymentInstallmentSchema.index({ dueDate: 1, status: 1 });

export const PaymentInstallment: Model<IPaymentInstallment> =
  mongoose.models.PaymentInstallment ?? mongoose.model<IPaymentInstallment>("PaymentInstallment", PaymentInstallmentSchema);
