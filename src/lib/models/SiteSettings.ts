import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface ISiteSettings extends Document {
  businessName: string;
  tagline: string;
  heroHeadline: string;
  heroEyebrow: string;
  heroSupporting: string;
  email: string;
  phone: string;
  facebookUrl: string;
  logoUrl: string;
  faviconUrl: string;
  heroImage?: { url: string; alt: string };
  aboutContent?: string;
  footerTagline?: string;
  announcementBanner?: {
    enabled: boolean;
    message: string;
    link?: string;
    startDate?: Date;
    endDate?: Date;
  };
  defaultSeo?: { title?: string; description?: string };
  contactRecipientEmail: string;
  bookingTerms?: string;
  privacyPolicy?: string;
  cancellationPolicy?: string;
  paymentPlanWording?: string;
  maintenanceMode: boolean;
  paypalEnabled: boolean;
  squareEnabled: boolean;
  manualPaymentEnabled: boolean;
  analyticsId?: string;
  metaPixelId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "SerenEScape Travel" },
    tagline: { type: String, default: "Belong Everywhere." },
    heroHeadline: { type: String, default: "Come for the Destination. Stay for the Community." },
    heroEyebrow: { type: String, default: "Luxury group travel for Black LGBTQIA+ women" },
    heroSupporting: { type: String, default: "" },
    email: { type: String, default: "letsescape@serenescapetravel.com" },
    phone: { type: String, default: "702-544-1028" },
    facebookUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "/brand/serenescape-logo.png" },
    faviconUrl: { type: String, default: "/brand/serenescape-logo.png" },
    heroImage: { url: String, alt: String },
    aboutContent: String,
    footerTagline: { type: String, default: "Built for belonging" },
    announcementBanner: {
      enabled: Boolean,
      message: String,
      link: String,
      startDate: Date,
      endDate: Date,
    },
    defaultSeo: { title: String, description: String },
    contactRecipientEmail: { type: String, default: "letsescape@serenescapetravel.com" },
    bookingTerms: String,
    privacyPolicy: String,
    cancellationPolicy: String,
    paymentPlanWording: String,
    maintenanceMode: { type: Boolean, default: false },
    paypalEnabled: { type: Boolean, default: true },
    squareEnabled: { type: Boolean, default: true },
    manualPaymentEnabled: { type: Boolean, default: false },
    analyticsId: String,
    metaPixelId: String,
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ?? mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
