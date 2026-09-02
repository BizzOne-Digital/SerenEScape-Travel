import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip } from "@/lib/models";
import type { TripCardData } from "@/components/trips/TripCard";
import type { TripStatus } from "@/types";

export type TripDetailData = {
  slug: string;
  title: string;
  shortDescription?: string;
  overview?: string;
  destination: string;
  cities: string[];
  startDate?: string | null;
  endDate?: string | null;
  durationDays: number;
  groupMin: number;
  groupMax: number;
  capacity: number;
  reservedCount: number;
  priceFromCents: number;
  salePriceCents?: number | null;
  currency: string;
  depositCents: number;
  payInFullDiscountPercent: number;
  paymentPlanEnabled: boolean;
  status: TripStatus;
  featured: boolean;
  isBookable: boolean;
  heroImage?: { url: string; alt: string } | null;
  gallery: { url: string; alt: string; order: number }[];
  itinerary: {
    dayNumber: number;
    date?: string | null;
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
  }[];
  accommodations: { name: string; description?: string; city?: string }[];
  roomOptions: { id: string; name: string; description?: string; supplementCents: number }[];
  excursions: { id: string; name: string; description?: string; priceCents: number; dayNumber?: number }[];
  inclusions: string[];
  exclusions: string[];
  meals: string[];
  faqItems: { question: string; answer: string }[];
  cancellationSummary?: string;
  seo?: { title?: string; description?: string; ogImage?: string };
  relatedTripIds?: string[];
};

function toTripCardData(trip: Record<string, unknown>): TripCardData {
  const doc = trip as {
    slug: string;
    title: string;
    destination: string;
    startDate?: Date;
    endDate?: Date;
    durationDays: number;
    groupMin: number;
    groupMax: number;
    capacity: number;
    reservedCount: number;
    priceFromCents: number;
    salePriceCents?: number;
    currency: string;
    depositCents: number;
    paymentPlanEnabled: boolean;
    status: TripStatus;
    featured?: boolean;
    heroImage?: { url: string; alt: string };
    shortDescription?: string;
  };

  return {
    slug: doc.slug,
    title: doc.title,
    destination: doc.destination,
    startDate: doc.startDate?.toISOString() ?? null,
    endDate: doc.endDate?.toISOString() ?? null,
    durationDays: doc.durationDays,
    groupMin: doc.groupMin,
    groupMax: doc.groupMax,
    capacity: doc.capacity,
    reservedCount: doc.reservedCount,
    priceFromCents: doc.priceFromCents,
    salePriceCents: doc.salePriceCents ?? null,
    currency: doc.currency,
    depositCents: doc.depositCents,
    paymentPlanEnabled: doc.paymentPlanEnabled,
    status: doc.status,
    featured: doc.featured ?? false,
    heroImage: doc.heroImage ?? null,
    shortDescription: doc.shortDescription ?? null,
  };
}

function toTripDetailData(trip: Record<string, unknown>): TripDetailData {
  const doc = trip as TripDetailData & {
    startDate?: Date;
    endDate?: Date;
    itinerary: { date?: Date; published: boolean }[];
    relatedTripIds?: { toString(): string }[];
  };

  return {
    ...doc,
    startDate: doc.startDate ? new Date(doc.startDate).toISOString() : null,
    endDate: doc.endDate ? new Date(doc.endDate).toISOString() : null,
    salePriceCents: doc.salePriceCents ?? null,
    heroImage: doc.heroImage ?? null,
    gallery: doc.gallery ?? [],
    itinerary: (doc.itinerary ?? [])
      .filter((day) => day.published !== false)
      .map((day) => ({
        ...day,
        date: day.date ? new Date(day.date).toISOString() : null,
      })),
    accommodations: doc.accommodations ?? [],
    roomOptions: doc.roomOptions ?? [],
    excursions: doc.excursions ?? [],
    inclusions: doc.inclusions ?? [],
    exclusions: doc.exclusions ?? [],
    meals: doc.meals ?? [],
    faqItems: doc.faqItems ?? [],
    relatedTripIds: doc.relatedTripIds?.map((id) => id.toString()) ?? [],
  };
}

export async function getPublishedTrips(): Promise<TripCardData[]> {
  if (!isDBConfigured()) return [];

  try {
    await connectDB();
    const trips = await Trip.find({ status: { $ne: "draft" } })
      .sort({ featured: -1, startDate: 1 })
      .lean();

    return trips.map((trip) => toTripCardData(trip as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getBookableTrips(): Promise<TripCardData[]> {
  if (!isDBConfigured()) return [];

  try {
    await connectDB();
    const trips = await Trip.find({
      status: { $in: ["booking_open", "limited_spots"] },
      isBookable: true,
    })
      .sort({ startDate: 1 })
      .lean();

    return trips.map((trip) => toTripCardData(trip as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getTripBySlug(slug: string): Promise<TripDetailData | null> {
  if (!isDBConfigured()) return null;

  try {
    await connectDB();
    const trip = await Trip.findOne({ slug, status: { $ne: "draft" } }).lean();
    if (!trip) return null;
    return toTripDetailData(trip as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function getRelatedTrips(
  relatedIds: string[],
  excludeSlug: string
): Promise<TripCardData[]> {
  if (!isDBConfigured() || relatedIds.length === 0) return [];

  try {
    await connectDB();
    const trips = await Trip.find({
      _id: { $in: relatedIds },
      slug: { $ne: excludeSlug },
      status: { $ne: "draft" },
    })
      .limit(3)
      .lean();

    return trips.map((trip) => toTripCardData(trip as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getAllTripSlugs(): Promise<string[]> {
  if (!isDBConfigured()) return [];

  try {
    await connectDB();
    const trips = await Trip.find({ status: { $ne: "draft" } }).select("slug").lean();
    return trips.map((t) => t.slug);
  } catch {
    return [];
  }
}
