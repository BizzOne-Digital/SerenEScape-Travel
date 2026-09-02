import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IWaitlistEntry extends Document {
  tripId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  travelerCount: number;
  notes?: string;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistEntrySchema = new Schema<IWaitlistEntry>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    travelerCount: { type: Number, default: 1 },
    notes: String,
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

WaitlistEntrySchema.index({ tripId: 1, email: 1 });

export const WaitlistEntry: Model<IWaitlistEntry> =
  mongoose.models.WaitlistEntry ?? mongoose.model<IWaitlistEntry>("WaitlistEntry", WaitlistEntrySchema);
