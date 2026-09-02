import mongoose, { Schema, type Model, type Document } from "mongoose";
import type { TripStatus } from "@/types";

export interface IItineraryDay {
  dayNumber: number;
  date?: Date;
  title: string;
  description: string;
  timeFrame?: string;
  city?: string;
  accommodation?: string;
  transportation?: string;
  mealsIncluded?: string[];
  excursionsIncluded?: string[];
  optionalExcursions?: { name: string; priceCents: number }[];
  goodToKnow?: string;
  images?: { url: string; alt: string }[];
  published: boolean;
}

export interface ITrip extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  overview?: string;
  destination: string;
  cities: string[];
  startDate?: Date;
  endDate?: Date;
  durationDays: number;
  groupMin: number;
  groupMax: number;
  capacity: number;
  reservedCount: number;
  priceFromCents: number;
  currency: string;
  depositCents: number;
  salePriceCents?: number;
  payInFullDiscountPercent: number;
  paymentPlanEnabled: boolean;
  status: TripStatus;
  bookingOpenAt?: Date;
  bookingCloseAt?: Date;
  featured: boolean;
  heroImage?: { url: string; alt: string };
  gallery: { url: string; alt: string; order: number }[];
  itinerary: IItineraryDay[];
  accommodations: { name: string; description?: string; city?: string }[];
  roomOptions: { id: string; name: string; description?: string; supplementCents: number }[];
  excursions: { id: string; name: string; description?: string; priceCents: number; dayNumber?: number }[];
  inclusions: string[];
  exclusions: string[];
  meals: string[];
  paymentScheduleTemplate?: {
    installmentCount: number;
    intervalDays: number;
    finalDeadline?: Date;
  };
  faqItems: { question: string; answer: string }[];
  seo?: { title?: string; description?: string; ogImage?: string };
  cancellationSummary?: string;
  relatedTripIds?: mongoose.Types.ObjectId[];
  publishedAt?: Date;
  isBookable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: String,
    overview: String,
    destination: { type: String, required: true },
    cities: [String],
    startDate: Date,
    endDate: Date,
    durationDays: { type: Number, required: true },
    groupMin: { type: Number, default: 8 },
    groupMax: { type: Number, default: 20 },
    capacity: { type: Number, default: 20 },
    reservedCount: { type: Number, default: 0 },
    priceFromCents: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    depositCents: { type: Number, default: 0 },
    salePriceCents: Number,
    payInFullDiscountPercent: { type: Number, default: 5 },
    paymentPlanEnabled: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "coming_soon", "booking_open", "limited_spots", "sold_out", "waitlist", "completed"],
      default: "draft",
    },
    bookingOpenAt: Date,
    bookingCloseAt: Date,
    featured: { type: Boolean, default: false },
    heroImage: { url: String, alt: String },
    gallery: [{ url: String, alt: String, order: Number }],
    itinerary: [{
      dayNumber: Number,
      date: Date,
      title: String,
      description: String,
      timeFrame: String,
      city: String,
      accommodation: String,
      transportation: String,
      mealsIncluded: [String],
      excursionsIncluded: [String],
      optionalExcursions: [{ name: String, priceCents: Number }],
      goodToKnow: String,
      images: [{ url: String, alt: String }],
      published: { type: Boolean, default: true },
    }],
    accommodations: [{ name: String, description: String, city: String }],
    roomOptions: [{ id: String, name: String, description: String, supplementCents: { type: Number, default: 0 } }],
    excursions: [{ id: String, name: String, description: String, priceCents: Number, dayNumber: Number }],
    inclusions: [String],
    exclusions: [String],
    meals: [String],
    paymentScheduleTemplate: {
      installmentCount: Number,
      intervalDays: Number,
      finalDeadline: Date,
    },
    faqItems: [{ question: String, answer: String }],
    seo: { title: String, description: String, ogImage: String },
    cancellationSummary: String,
    relatedTripIds: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
    publishedAt: Date,
    isBookable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TripSchema.index({ slug: 1 });
TripSchema.index({ status: 1, featured: 1 });
TripSchema.index({ startDate: 1 });

export const Trip: Model<ITrip> = mongoose.models.Trip ?? mongoose.model<ITrip>("Trip", TripSchema);
