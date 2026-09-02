import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface ITestimonial extends Document {
  name?: string;
  location?: string;
  tripTitle?: string;
  content: string;
  rating?: number;
  image?: { url: string; alt: string };
  approved: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: String,
    location: String,
    tripTitle: String,
    content: { type: String, required: true },
    rating: Number,
    image: { url: String, alt: String },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ?? mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
