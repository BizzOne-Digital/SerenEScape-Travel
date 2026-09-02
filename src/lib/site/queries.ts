import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { SiteSettings, Founder, FAQ, Testimonial } from "@/lib/models";
import type { FounderData } from "@/components/public/home/FoundersSection";
import type { FAQData } from "@/components/public/home/FAQPreview";
import type { TestimonialData } from "@/components/public/home/TestimonialsSection";

export type SiteSettingsData = {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  aboutContent?: string;
  privacyPolicy?: string;
  bookingTerms?: string;
  cancellationPolicy?: string;
  paymentPlanWording?: string;
  paypalEnabled: boolean;
  squareEnabled: boolean;
};

const DEFAULT_SETTINGS: SiteSettingsData = {
  businessName: "SerenEScape Travel",
  tagline: "Belong Everywhere.",
  email: "letsescape@serenescapetravel.com",
  phone: "702-544-1028",
  paypalEnabled: true,
  squareEnabled: true,
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  if (!isDBConfigured()) return DEFAULT_SETTINGS;

  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    if (!settings) return DEFAULT_SETTINGS;

    return {
      businessName: settings.businessName,
      tagline: settings.tagline,
      email: settings.email,
      phone: settings.phone,
      aboutContent: settings.aboutContent,
      privacyPolicy: settings.privacyPolicy,
      bookingTerms: settings.bookingTerms,
      cancellationPolicy: settings.cancellationPolicy,
      paymentPlanWording: settings.paymentPlanWording,
      paypalEnabled: settings.paypalEnabled,
      squareEnabled: settings.squareEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getPublishedFounders(): Promise<FounderData[]> {
  if (!isDBConfigured()) return [];

  try {
    await connectDB();
    const founders = await Founder.find({ published: true }).sort({ order: 1 }).lean();
    return founders.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      title: item.title,
      bio: item.bio,
      welcomeNote: item.welcomeNote,
      image: item.image,
      order: item.order,
      isPlaceholder: item.isPlaceholder,
    }));
  } catch {
    return [];
  }
}

export async function getPublishedFAQs(): Promise<FAQData[]> {
  if (!isDBConfigured()) return [];

  try {
    await connectDB();
    const faqs = await FAQ.find({ published: true, isDraft: false })
      .sort({ category: 1, order: 1 })
      .lean();

    return faqs.map((item) => ({
      _id: item._id.toString(),
      category: item.category,
      question: item.question,
      answer: item.answer,
      order: item.order,
    }));
  } catch {
    return [];
  }
}

export async function getApprovedTestimonials(): Promise<TestimonialData[]> {
  if (!isDBConfigured()) return [];

  try {
    await connectDB();
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return testimonials.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      location: item.location,
      tripTitle: item.tripTitle,
      content: item.content,
      rating: item.rating,
    }));
  } catch {
    return [];
  }
}
