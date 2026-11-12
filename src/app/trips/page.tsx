import type { Metadata } from "next";
import { PageHero, heroProps } from "@/components/shared/PageHero";
import { TripsListing } from "@/components/trips/TripsListing";
import { getPublishedTrips } from "@/lib/trips/queries";
import { getPageContent, getPageSeo } from "@/lib/content/get";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("trips");
}

export default async function TripsPage() {
  const [trips, content] = await Promise.all([getPublishedTrips(), getPageContent("trips")]);

  return (
    <>
      <PageHero {...heroProps(content.hero, "dark")} />
      <TripsListing trips={trips} />
    </>
  );
}
