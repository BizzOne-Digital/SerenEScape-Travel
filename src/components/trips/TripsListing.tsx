"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { TripCard, type TripCardData } from "@/components/trips/TripCard";
import { TripCardSkeleton } from "@/components/trips/TripCardSkeleton";
import { Container } from "@/components/ui/Container";
import type { TripStatus } from "@/types";
import { cn } from "@/lib/utils";
import { getEffectivePriceCents } from "@/lib/pricing";

export type SortOption = "date_asc" | "date_desc" | "price_asc" | "price_desc" | "duration_asc" | "featured";

export interface TripFilters {
  search: string;
  destination: string;
  year: string;
  status: string;
  duration: string;
  priceRange: string;
  paymentPlan: string;
  featured: string;
  sort: SortOption;
}

const DEFAULT_FILTERS: TripFilters = {
  search: "",
  destination: "",
  year: "",
  status: "",
  duration: "",
  priceRange: "",
  paymentPlan: "",
  featured: "",
  sort: "featured",
};

interface TripsListingProps {
  trips: TripCardData[];
}

function getYear(date?: string | Date | null): number | null {
  if (!date) return null;
  return new Date(date).getFullYear();
}

function matchesDuration(days: number, range: string): boolean {
  switch (range) {
    case "short":
      return days <= 7;
    case "medium":
      return days >= 8 && days <= 14;
    case "long":
      return days >= 15;
    default:
      return true;
  }
}

function matchesPrice(cents: number, range: string): boolean {
  switch (range) {
    case "under3k":
      return cents < 300000;
    case "3k-5k":
      return cents >= 300000 && cents < 500000;
    case "5k-8k":
      return cents >= 500000 && cents < 800000;
    case "over8k":
      return cents >= 800000;
    default:
      return true;
  }
}

function sortTrips(trips: TripCardData[], sort: SortOption): TripCardData[] {
  const sorted = [...trips];
  switch (sort) {
    case "price_asc":
      return sorted.sort(
        (a, b) =>
          getEffectivePriceCents(a.priceFromCents, a.salePriceCents) -
          getEffectivePriceCents(b.priceFromCents, b.salePriceCents)
      );
    case "price_desc":
      return sorted.sort(
        (a, b) =>
          getEffectivePriceCents(b.priceFromCents, b.salePriceCents) -
          getEffectivePriceCents(a.priceFromCents, a.salePriceCents)
      );
    case "duration_asc":
      return sorted.sort((a, b) => a.durationDays - b.durationDays);
    case "date_asc":
      return sorted.sort((a, b) => {
        const aDate = a.startDate ? new Date(a.startDate).getTime() : Infinity;
        const bDate = b.startDate ? new Date(b.startDate).getTime() : Infinity;
        return aDate - bDate;
      });
    case "date_desc":
      return sorted.sort((a, b) => {
        const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
        const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
        return bDate - aDate;
      });
    case "featured":
    default:
      return sorted;
  }
}

export function TripsListing({ trips }: TripsListingProps) {
  const [filters, setFilters] = useState<TripFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading] = useState(false);

  const destinations = useMemo(
    () => [...new Set(trips.map((t) => t.destination))].sort(),
    [trips]
  );

  const years = useMemo(() => {
    const yearSet = new Set<number>();
    trips.forEach((t) => {
      const y = getYear(t.startDate);
      if (y) yearSet.add(y);
    });
    return [...yearSet].sort();
  }, [trips]);

  const statuses: TripStatus[] = [
    "coming_soon",
    "booking_open",
    "limited_spots",
    "sold_out",
    "waitlist",
    "completed",
  ];

  const filteredTrips = useMemo(() => {
    const result = trips.filter((trip) => {
      const price = getEffectivePriceCents(trip.priceFromCents, trip.salePriceCents);
      const searchLower = filters.search.toLowerCase();

      if (
        filters.search &&
        !trip.title.toLowerCase().includes(searchLower) &&
        !trip.destination.toLowerCase().includes(searchLower) &&
        !(trip.shortDescription?.toLowerCase().includes(searchLower) ?? false)
      ) {
        return false;
      }
      if (filters.destination && trip.destination !== filters.destination) return false;
      if (filters.year && getYear(trip.startDate)?.toString() !== filters.year) return false;
      if (filters.status && trip.status !== filters.status) return false;
      if (filters.duration && !matchesDuration(trip.durationDays, filters.duration)) return false;
      if (filters.priceRange && !matchesPrice(price, filters.priceRange)) return false;
      if (filters.paymentPlan === "yes" && !trip.paymentPlanEnabled) return false;
      if (filters.paymentPlan === "no" && trip.paymentPlanEnabled) return false;
      if (filters.featured === "yes" && !trip.featured) return false;
      return true;
    });

    return sortTrips(result, filters.sort);
  }, [trips, filters]);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "sort" && value !== ""
  ).length;

  function updateFilter<K extends keyof TripFilters>(key: K, value: TripFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  const selectClass =
    "w-full rounded-xl border border-muted-gold/30 bg-soft-ivory px-4 py-2.5 font-sans text-sm text-luxury-ink focus:border-rich-berry focus:outline-none focus:ring-2 focus:ring-rich-berry/20";

  return (
    <section className="bg-soft-ivory py-12 sm:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative w-full min-w-0 sm:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-ink/40" />
            <input
              type="search"
              placeholder="Search journeys..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full rounded-full border border-muted-gold/30 bg-soft-ivory py-3 pl-11 pr-4 font-sans text-sm focus:border-rich-berry focus:outline-none focus:ring-2 focus:ring-rich-berry/20"
              aria-label="Search trips"
            />
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 font-sans text-sm font-medium transition-colors sm:flex-none sm:px-5",
                showFilters
                  ? "border-rich-berry bg-rich-berry/10 text-rich-berry"
                  : "border-muted-gold/30 text-deep-aubergine hover:bg-warm-sand/50"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rich-berry text-xs text-soft-ivory">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value as SortOption)}
              className="min-w-0 flex-1 rounded-full border border-muted-gold/30 bg-soft-ivory px-4 py-2.5 font-sans text-sm focus:border-rich-berry focus:outline-none sm:flex-none"
              aria-label="Sort trips"
            >
              <option value="featured">Featured</option>
              <option value="date_asc">Date: Soonest</option>
              <option value="date_desc">Date: Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="duration_asc">Duration: Shortest</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 rounded-2xl border border-muted-gold/20 bg-warm-sand/20 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-deep-aubergine">Filter Journeys</h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 font-sans text-sm text-rich-berry hover:text-deep-aubergine"
                >
                  <X className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="filter-destination" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-luxury-ink/60">
                  Destination
                </label>
                <select
                  id="filter-destination"
                  value={filters.destination}
                  onChange={(e) => updateFilter("destination", e.target.value)}
                  className={selectClass}
                >
                  <option value="">All destinations</option>
                  {destinations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-year" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-luxury-ink/60">
                  Year
                </label>
                <select
                  id="filter-year"
                  value={filters.year}
                  onChange={(e) => updateFilter("year", e.target.value)}
                  className={selectClass}
                >
                  <option value="">All years</option>
                  {years.map((y) => (
                    <option key={y} value={y.toString()}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-status" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-luxury-ink/60">
                  Status
                </label>
                <select
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className={selectClass}
                >
                  <option value="">All statuses</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-duration" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-luxury-ink/60">
                  Duration
                </label>
                <select
                  id="filter-duration"
                  value={filters.duration}
                  onChange={(e) => updateFilter("duration", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Any duration</option>
                  <option value="short">Up to 7 days</option>
                  <option value="medium">8–14 days</option>
                  <option value="long">15+ days</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-price" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-luxury-ink/60">
                  Price
                </label>
                <select
                  id="filter-price"
                  value={filters.priceRange}
                  onChange={(e) => updateFilter("priceRange", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Any price</option>
                  <option value="under3k">Under $3,000</option>
                  <option value="3k-5k">$3,000 – $5,000</option>
                  <option value="5k-8k">$5,000 – $8,000</option>
                  <option value="over8k">$8,000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-payment" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-luxury-ink/60">
                  Payment Plan
                </label>
                <select
                  id="filter-payment"
                  value={filters.paymentPlan}
                  onChange={(e) => updateFilter("paymentPlan", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Any</option>
                  <option value="yes">Payment plan available</option>
                  <option value="no">Pay in full only</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-featured" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-luxury-ink/60">
                  Featured
                </label>
                <select
                  id="filter-featured"
                  value={filters.featured}
                  onChange={(e) => updateFilter("featured", e.target.value)}
                  className={selectClass}
                >
                  <option value="">All journeys</option>
                  <option value="yes">Featured only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <p className="mb-6 font-sans text-sm text-luxury-ink/60">
          {filteredTrips.length} {filteredTrips.length === 1 ? "journey" : "journeys"} found
        </p>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-muted-gold/40 bg-warm-sand/20 px-8 py-16 text-center">
            <p className="font-display text-2xl text-deep-aubergine/70">No journeys match your filters</p>
            <p className="mt-3 font-sans text-sm text-luxury-ink/60">
              Try adjusting your search or clearing filters to see all available trips.
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-deep-aubergine"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip, index) => (
              <TripCard key={trip.slug} trip={trip} priority={index < 3} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
