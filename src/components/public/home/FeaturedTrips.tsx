import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TripCard, type TripCardData } from "@/components/trips/TripCard";

interface FeaturedTripsProps {
  trips: TripCardData[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function FeaturedTrips({
  trips,
  eyebrow = "Upcoming Journeys",
  title = "Featured Escapes",
  description = "Handpicked group experiences designed for connection, culture, and uncompromising comfort.",
}: FeaturedTripsProps) {
  if (trips.length === 0) return null;

  return (
    <section id="trips" className="gradient-ivory py-20 lg:py-28" aria-labelledby="featured-trips-heading">
      <Container>
        <SectionHeading
          id="featured-trips-heading"
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          className="mb-14"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, index) => (
            <TripCard key={trip.slug} trip={trip} priority={index < 2} />
          ))}
        </div>
      </Container>
    </section>
  );
}
