import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IFounder extends Document {
  name?: string;
  title?: string;
  bio?: string;
  welcomeNote?: string;
  image?: { url: string; alt: string };
  order: number;
  published: boolean;
  isPlaceholder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FounderSchema = new Schema<IFounder>(
  {
    name: String,
    title: String,
    bio: String,
    welcomeNote: String,
    image: { url: String, alt: String },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    isPlaceholder: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Founder: Model<IFounder> = mongoose.models.Founder ?? mongoose.model<IFounder>("Founder", FounderSchema);
