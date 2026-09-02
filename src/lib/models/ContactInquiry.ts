import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  tripSlug?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    tripSlug: String,
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
  },
  { timestamps: true }
);

export const ContactInquiry: Model<IContactInquiry> =
  mongoose.models.ContactInquiry ?? mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);
