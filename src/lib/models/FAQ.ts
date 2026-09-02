import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IFAQ extends Document {
  category: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FAQSchema.index({ category: 1, order: 1 });

export const FAQ: Model<IFAQ> = mongoose.models.FAQ ?? mongoose.model<IFAQ>("FAQ", FAQSchema);
