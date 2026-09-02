import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { IMAGES } from "@/config/images";
import { getTripBySlug } from "@/lib/trips/queries";
import { getSiteSettings } from "@/lib/site/queries";

interface BookingTripPageProps {
  params: Promise<{ tripSlug: string }>;
}

export async function generateMetadata({ params }: BookingTripPageProps): Promise<Metadata> {
  const { tripSlug } = await params;
  const trip = await getTripBySlug(tripSlug);
  return {
    title: trip ? `Book ${trip.title}` : "Book Your Trip",
    description: trip ? `Complete your booking for ${trip.title}` : undefined,
  };
}

export default async function BookingTripPage({ params }: BookingTripPageProps) {
  const { tripSlug } = await params;
  const [trip, settings] = await Promise.all([
    getTripBySlug(tripSlug),
    getSiteSettings(),
  ]);

  if (!trip || !trip.isBookable) {
    notFound();
  }

  return (
    <>
      <PageHero
        variant="image"
        imageSrc={trip.heroImage?.url ?? IMAGES.hero.src}
        imageAlt={trip.heroImage?.alt ?? trip.title}
        eyebrow="Booking"
        title={trip.title}
        description={trip.destination}
        compact
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <BookingFlow
            trip={trip}
            paypalEnabled={settings.paypalEnabled}
            squareEnabled={settings.squareEnabled}
          />
        </Container>
      </section>
    </>
  );
}
