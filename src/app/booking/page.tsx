import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { TripCard } from "@/components/trips/TripCard";
import { getBookableTrips } from "@/lib/trips/queries";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Your Escape",
  description: "Select a journey and start your booking with SerenEScape Travel.",
};

export default async function BookingPage() {
  const trips = await getBookableTrips();

  return (
    <>
      <PageHero
        variant="dark"
        eyebrow="Reserve Your Spot"
        title="Book Your Escape"
        description="Choose a journey below to begin your booking. Flexible payment options including deposits and payment plans."
        watermark="Your Journey Starts Here"
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          {trips.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-muted-gold/40 bg-warm-sand/20 px-8 py-16 text-center">
              <p className="font-display text-2xl text-deep-aubergine/70">
                No trips open for booking right now
              </p>
              <p className="mt-3 font-sans text-sm text-luxury-ink/60">
                Check back soon or explore all our journeys.
              </p>
              <Link
                href="/trips"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-deep-aubergine"
              >
                View All Trips
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-8 font-sans text-sm text-luxury-ink/60">
                {trips.length} {trips.length === 1 ? "journey" : "journeys"} available for booking
              </p>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip, index) => (
                  <div key={trip.slug} className="flex flex-col">
                    <TripCard trip={trip} priority={index < 3} />
                    <Link
                      href={`/booking/${trip.slug}`}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-burnt-orange px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-marigold hover:text-luxury-ink"
                    >
                      Start Booking
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
