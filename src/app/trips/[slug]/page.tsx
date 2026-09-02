import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TripDetailContent } from "@/components/trips/TripDetailContent";
import { getTripBySlug, getRelatedTrips } from "@/lib/trips/queries";

interface TripPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) {
    return { title: "Trip Not Found" };
  }

  const title = trip.seo?.title ?? trip.title;
  const description =
    trip.seo?.description ?? trip.shortDescription ?? `Join us for ${trip.title} in ${trip.destination}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: trip.seo?.ogImage
        ? [{ url: trip.seo.ogImage }]
        : trip.heroImage
          ? [{ url: trip.heroImage.url, alt: trip.heroImage.alt }]
          : undefined,
    },
  };
}

export default async function TripDetailPage({ params }: TripPageProps) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const relatedTrips = await getRelatedTrips(trip.relatedTripIds ?? [], slug);

  return <TripDetailContent trip={trip} relatedTrips={relatedTrips} />;
}
