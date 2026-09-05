import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { IMAGES } from "@/config/images";
import { TripsListing } from "@/components/trips/TripsListing";
import { getPublishedTrips } from "@/lib/trips/queries";

export const metadata: Metadata = {
  title: "Our Journeys",
  description:
    "Explore curated luxury group travel experiences for Black LGBTQIA+ women. Filter by destination, dates, and payment options.",
};

export default async function TripsPage() {
  const trips = await getPublishedTrips();

  return (
    <>
      <PageHero
        variant="image"
        imageSrc={IMAGES.pageHeroTrips.src}
        imageAlt={IMAGES.pageHeroTrips.alt}
        eyebrow="Explore"
        title="Our Journeys"
        description="Curated adventures where safety, luxury, and community come together. Find your next escape."
        watermark="Adventure Awaits"
      />
      <TripsListing trips={trips} />
    </>
  );
}
