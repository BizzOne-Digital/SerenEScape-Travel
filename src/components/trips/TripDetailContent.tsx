"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { TripCard } from "@/components/trips/TripCard";
import type { TripCardData } from "@/components/trips/TripCard";
import type { TripDetailData } from "@/lib/trips/queries";
import { formatCents, getEffectivePriceCents } from "@/lib/pricing";
import { BRAND } from "@/config/brand";
import { IMAGES, getTripHeroImage, shouldUnoptimizeImage } from "@/config/images";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TripDetailContentProps {
  trip: TripDetailData;
  relatedTrips: TripCardData[];
}

function formatDateRange(start?: string | null, end?: string | null): string | null {
  if (!start) return null;
  const startDate = new Date(start);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (!end) return formatter.format(startDate);
  return `${formatter.format(startDate)} – ${formatter.format(new Date(end))}`;
}

export function TripDetailContent({ trip, relatedTrips }: TripDetailContentProps) {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const inView = useInView(heroRef, { once: true });
  const effectivePrice = getEffectivePriceCents(trip.priceFromCents, trip.salePriceCents);
  const spotsLeft = Math.max(0, trip.capacity - trip.reservedCount);
  const dateRange = formatDateRange(trip.startDate, trip.endDate);
  const tripHeroFallback = getTripHeroImage(trip.slug);
  const heroUrl = trip.heroImage?.url ?? tripHeroFallback.src;
  const canBook =
    trip.isBookable &&
    ["booking_open", "limited_spots"].includes(trip.status) &&
    spotsLeft > 0;

  return (
    <>
      <section ref={heroRef} className="relative min-h-[68vh] overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={heroUrl}
            alt={trip.heroImage?.alt ?? trip.title}
            fill
            priority
            unoptimized={shouldUnoptimizeImage(heroUrl)}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-ink/80 via-luxury-ink/45 to-luxury-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink via-luxury-ink/55 to-luxury-ink/15" />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-rich-berry/25 blur-[90px]" />
          <div className="absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-burnt-orange/20 blur-[80px]" />
        </div>

        <div className="grain-overlay pointer-events-none absolute inset-0 opacity-40" aria-hidden />

        <Container className="relative z-10 flex min-h-[68vh] flex-col justify-end pb-14 pt-32 sm:pb-16">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge status={trip.status} />
              {trip.featured && (
                <span className="inline-flex items-center rounded-full border border-marigold/40 bg-marigold/90 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-luxury-ink">
                  Featured
                </span>
              )}
            </div>

            <p className="mb-2 flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-wider text-marigold">
              <MapPin className="h-4 w-4" />
              {trip.destination}
            </p>
            <h1 className="max-w-4xl break-words font-display text-3xl font-medium text-soft-ivory sm:text-5xl lg:text-6xl">
              {trip.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-6 font-sans text-sm text-soft-ivory/80">
              {dateRange && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-gold" />
                  {dateRange}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-gold" />
                {trip.durationDays} days
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-gold" />
                Group of {trip.groupMin}–{trip.groupMax}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-6">
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-soft-ivory/60">From</p>
                <p className="font-display text-3xl text-soft-ivory">
                  {formatCents(effectivePrice, trip.currency)}
                </p>
                {trip.depositCents > 0 && (
                  <p className="mt-1 font-sans text-sm text-soft-ivory/70">
                    {formatCents(trip.depositCents, trip.currency)} deposit
                  </p>
                )}
              </div>
              {canBook && (
                <Link
                  href={`/booking/${trip.slug}`}
                  className="inline-flex items-center rounded-full bg-burnt-orange px-8 py-4 font-sans text-sm font-medium text-soft-ivory transition-colors hover:bg-marigold hover:text-luxury-ink"
                >
                  Book This Journey
                </Link>
              )}
            </div>
          </motion.div>
        </Container>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10" aria-hidden>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="h-10 w-full fill-soft-ivory sm:h-14">
            <path d="M0,40 C320,56 640,24 960,40 C1200,52 1320,48 1440,40 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>

      {trip.overview && (
        <section className="bg-soft-ivory py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Overview" title="Your Journey Awaits" className="mb-8" />
            <div className="prose prose-lg max-w-none font-sans text-luxury-ink/85">
              {trip.overview.split("\n").map((para, i) => (
                <p key={i} className="mb-4 leading-relaxed last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {trip.itinerary.length > 0 && (
        <ItinerarySection itinerary={trip.itinerary} />
      )}

      {trip.accommodations.length > 0 && (
        <section className="bg-warm-sand/20 py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Stay" title="Accommodations" className="mb-10" />
            <div className="grid gap-6 sm:grid-cols-2">
              {trip.accommodations.map((acc, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-muted-gold/20 bg-soft-ivory p-6"
                >
                  <h3 className="font-display text-xl text-deep-aubergine">{acc.name}</h3>
                  {acc.city && (
                    <p className="mt-1 font-sans text-sm text-rich-berry">{acc.city}</p>
                  )}
                  {acc.description && (
                    <p className="mt-3 font-sans text-sm leading-relaxed text-luxury-ink/75">
                      {acc.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-soft-ivory py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {trip.inclusions.length > 0 && (
              <div>
                <SectionHeading eyebrow="Included" title="What's Included" className="mb-6" />
                <ul className="space-y-3">
                  {trip.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-sm text-luxury-ink/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {trip.exclusions.length > 0 && (
              <div>
                <SectionHeading eyebrow="Not Included" title="What's Not Included" className="mb-6" />
                <ul className="space-y-3">
                  {trip.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-sm text-luxury-ink/80">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-rich-berry/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>

      <PricingSection trip={trip} effectivePrice={effectivePrice} />

      {trip.faqItems.length > 0 && (
        <TripFAQSection faqs={trip.faqItems} />
      )}

      {trip.gallery.length > 0 && (
        <GallerySection gallery={trip.gallery} title={trip.title} />
      )}

      {relatedTrips.length > 0 && (
        <section className="bg-warm-sand/20 py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Explore More"
              title="Related Journeys"
              align="center"
              className="mb-10"
            />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((t) => (
                <TripCard key={t.slug} trip={t} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {canBook && <StickyMobileCTA slug={trip.slug} price={effectivePrice} currency={trip.currency} />}
    </>
  );
}

function ItinerarySection({
  itinerary,
}: {
  itinerary: TripDetailData["itinerary"];
}) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));
  const reducedMotion = useReducedMotion();

  function toggleDay(dayNumber: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) next.delete(dayNumber);
      else next.add(dayNumber);
      return next;
    });
  }

  return (
    <section className="bg-warm-sand/20 py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Itinerary" title="Day by Day" className="mb-10" />
        <div className="space-y-3">
          {itinerary.map((day) => {
            const isOpen = openDays.has(day.dayNumber);
            const panelId = `day-panel-${day.dayNumber}`;
            const buttonId = `day-button-${day.dayNumber}`;

            return (
              <div
                key={day.dayNumber}
                className="overflow-hidden rounded-2xl border border-muted-gold/20 bg-soft-ivory"
              >
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-warm-sand/30"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleDay(day.dayNumber)}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-aubergine/10 font-display text-lg text-deep-aubergine">
                      {day.dayNumber}
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-deep-aubergine">{day.title}</h3>
                      {day.city && (
                        <p className="font-sans text-sm text-luxury-ink/60">{day.city}</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-rich-berry transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-warm-sand px-6 py-5">
                        <p className="font-sans text-sm leading-relaxed text-luxury-ink/80">
                          {day.description}
                        </p>
                        {day.mealsIncluded && day.mealsIncluded.length > 0 && (
                          <p className="mt-3 font-sans text-sm text-luxury-ink/70">
                            <strong>Meals:</strong> {day.mealsIncluded.join(", ")}
                          </p>
                        )}
                        {day.goodToKnow && (
                          <p className="mt-3 rounded-lg bg-warm-sand/40 px-4 py-3 font-sans text-sm text-luxury-ink/75">
                            <strong>Good to know:</strong> {day.goodToKnow}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function PricingSection({
  trip,
  effectivePrice,
}: {
  trip: TripDetailData;
  effectivePrice: number;
}) {
  return (
    <section className="bg-deep-aubergine py-16 text-soft-ivory sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Pricing"
              title="Investment in Belonging"
              description="Transparent pricing with flexible payment options designed for our community."
              className="[&_h2]:text-soft-ivory [&_p]:text-soft-ivory/75 [&_p]:text-base"
            />
          </div>
          <div className="rounded-2xl border border-muted-gold/20 bg-soft-ivory/5 p-8">
            <div className="space-y-4 font-sans text-sm">
              <div className="flex justify-between border-b border-soft-ivory/10 pb-3">
                <span className="text-soft-ivory/70">Per person</span>
                <span className="font-display text-2xl text-marigold">
                  {formatCents(effectivePrice, trip.currency)}
                </span>
              </div>
              {trip.depositCents > 0 && (
                <div className="flex justify-between">
                  <span className="text-soft-ivory/70">Deposit to reserve</span>
                  <span>{formatCents(trip.depositCents, trip.currency)}</span>
                </div>
              )}
              {trip.paymentPlanEnabled && (
                <div className="flex justify-between">
                  <span className="text-soft-ivory/70">Payment plan</span>
                  <span className="text-emerald">Available</span>
                </div>
              )}
              {trip.payInFullDiscountPercent > 0 && (
                <div className="flex justify-between">
                  <span className="text-soft-ivory/70">Pay in full discount</span>
                  <span className="text-marigold">{trip.payInFullDiscountPercent}% off</span>
                </div>
              )}
            </div>
            {trip.cancellationSummary && (
              <p className="mt-6 border-t border-soft-ivory/10 pt-4 font-sans text-xs text-soft-ivory/60">
                {trip.cancellationSummary}
              </p>
            )}
            {trip.isBookable && (
              <Link
                href={`/booking/${trip.slug}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-burnt-orange px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-marigold hover:text-luxury-ink"
              >
                Start Booking
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function TripFAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-warm-sand/20 py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="FAQ" title="Trip Questions" className="mb-10" />
        <div className="divide-y divide-muted-gold/20 rounded-2xl border border-muted-gold/20 bg-soft-ivory">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-warm-sand/30"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="flex items-center gap-3 font-display text-lg text-deep-aubergine">
                    <HelpCircle className="h-5 w-5 shrink-0 text-rich-berry" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-rich-berry transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 pl-14 font-sans text-sm leading-relaxed text-luxury-ink/75">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function GallerySection({
  gallery,
  title,
}: {
  gallery: { url: string; alt: string; order: number }[];
  title: string;
}) {
  const sorted = [...gallery].sort((a, b) => a.order - b.order);

  return (
    <section className="bg-soft-ivory py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Gallery" title="Moments From the Journey" className="mb-10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((img, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StickyMobileCTA({
  slug,
  price,
  currency,
}: {
  slug: string;
  price: number;
  currency: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-muted-gold/20 bg-soft-ivory/95 p-4 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-sans text-xs text-luxury-ink/60">From</p>
          <p className="font-display text-xl text-deep-aubergine">{formatCents(price, currency)}</p>
        </div>
        <Link
          href={`/booking/${slug}`}
          className="inline-flex shrink-0 items-center rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory"
        >
          Book Now
        </Link>
      </div>
      <p className="mt-2 text-center font-sans text-[10px] text-luxury-ink/40">
        {BRAND.tagline}
      </p>
    </div>
  );
}
