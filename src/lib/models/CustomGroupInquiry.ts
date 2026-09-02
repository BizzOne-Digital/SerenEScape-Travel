import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface ICustomGroupInquiry extends Document {
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  destination?: string;
  groupSize?: number;
  preferredDates?: string;
  budget?: string;
  accommodation?: string;
  activities?: string;
  accessibility?: string;
  notes?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const CustomGroupInquirySchema = new Schema<ICustomGroupInquiry>(
  {
    organizationName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    destination: String,
    groupSize: Number,
    preferredDates: String,
    budget: String,
    accommodation: String,
    activities: String,
    accessibility: String,
    notes: String,
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
  },
  { timestamps: true }
);

export const CustomGroupInquiry: Model<ICustomGroupInquiry> =
  mongoose.models.CustomGroupInquiry ?? mongoose.model<ICustomGroupInquiry>("CustomGroupInquiry", CustomGroupInquirySchema);
