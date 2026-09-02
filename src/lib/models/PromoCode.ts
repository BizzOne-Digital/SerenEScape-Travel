import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  internalName: string;
  publicDescription?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  applicableTripIds?: mongoose.Types.ObjectId[];
  minimumSpendCents?: number;
  startDate?: Date;
  endDate?: Date;
  maxRedemptions?: number;
  redemptionCount: number;
  perEmailLimit: number;
  active: boolean;
  publicDisplay: boolean;
  homepageBanner: boolean;
  stackable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    internalName: { type: String, required: true },
    publicDescription: String,
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    applicableTripIds: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
    minimumSpendCents: Number,
    startDate: Date,
    endDate: Date,
    maxRedemptions: Number,
    redemptionCount: { type: Number, default: 0 },
    perEmailLimit: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    publicDisplay: { type: Boolean, default: false },
    homepageBanner: { type: Boolean, default: false },
    stackable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PromoCodeSchema.index({ code: 1 });
PromoCodeSchema.index({ active: 1, startDate: 1, endDate: 1 });

export const PromoCode: Model<IPromoCode> = mongoose.models.PromoCode ?? mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);
