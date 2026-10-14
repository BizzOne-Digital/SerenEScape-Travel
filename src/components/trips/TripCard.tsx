"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Users,
} from "lucide-react";
import type { TripStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatCents, getEffectivePriceCents } from "@/lib/pricing";
import { getTripHeroImage, shouldUnoptimizeImage } from "@/config/images";
import { cn } from "@/lib/utils";

export type TripCardData = {
  slug: string;
  title: string;
  destination: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  durationDays: number;
  groupMin: number;
  groupMax: number;
  capacity: number;
  reservedCount: number;
  priceFromCents: number;
  salePriceCents?: number | null;
  currency?: string;
  depositCents: number;
  paymentPlanEnabled: boolean;
  status: TripStatus;
  featured?: boolean;
  heroImage?: { url: string; alt: string } | null;
  shortDescription?: string | null;
};

interface TripCardProps {
  trip: TripCardData;
  priority?: boolean;
  className?: string;
}

function formatDateRange(
  start?: string | Date | null,
  end?: string | Date | null
): string | null {
  if (!start) return null;
  const startDate = new Date(start);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!end) return formatter.format(startDate);

  const endDate = new Date(end);
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(startDate);

  return `${startFmt} – ${formatter.format(endDate)}`;
}

function TripCardTilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [tiltEnabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!tiltEnabled) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTransform(
      `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale3d(1.02, 1.02, 1.02)`
    );
  }

  function handleMouseLeave() {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tiltEnabled ? transform : undefined,
        transition: tiltEnabled ? "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" : undefined,
        transformStyle: tiltEnabled ? "preserve-3d" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function TripCard({ trip, priority = false, className }: TripCardProps) {
  const spotsLeft = Math.max(0, trip.capacity - trip.reservedCount);
  const effectivePrice = getEffectivePriceCents(trip.priceFromCents, trip.salePriceCents);
  const currency = trip.currency ?? "USD";
  const dateRange = formatDateRange(trip.startDate, trip.endDate);
  const fallback = getTripHeroImage(trip.slug);
  const imageUrl = trip.heroImage?.url ?? fallback.src;
  const imageAlt = trip.heroImage?.alt ?? fallback.alt;

  const isOnSale =
    trip.salePriceCents != null &&
    trip.salePriceCents > 0 &&
    trip.salePriceCents < trip.priceFromCents;

  return (
    <TripCardTilt className={cn("group h-full", className)}>
      <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-muted-gold/20 bg-soft-ivory shadow-lg shadow-luxury-ink/5 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-rich-berry/10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority={priority}
            unoptimized={shouldUnoptimizeImage(imageUrl)}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/60 via-transparent to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge status={trip.status} />
            {isOnSale && (
              <span className="inline-flex items-center rounded-full border border-marigold/40 bg-marigold/90 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-luxury-ink">
                Special Offer
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p className="flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-wider text-soft-ivory/80">
              <MapPin className="h-3.5 w-3.5" />
              {trip.destination}
            </p>
            <h3 className="mt-1 font-display text-2xl font-medium text-soft-ivory">
              {trip.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {trip.shortDescription && (
            <p className="mb-4 line-clamp-2 font-sans text-sm leading-relaxed text-luxury-ink/70">
              {trip.shortDescription}
            </p>
          )}

          <ul className="mb-5 space-y-2.5 font-sans text-sm text-luxury-ink/80">
            {dateRange && (
              <li className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 shrink-0 text-muted-gold" />
                {dateRange}
              </li>
            )}
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-muted-gold" />
              {trip.durationDays} days
            </li>
            <li className="flex items-center gap-2.5">
              <Users className="h-4 w-4 shrink-0 text-muted-gold" />
              Group of {trip.groupMin}–{trip.groupMax}
            </li>
            {trip.paymentPlanEnabled && (
              <li className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4 shrink-0 text-muted-gold" />
                Payment plan available
              </li>
            )}
          </ul>

          <div className="mt-auto border-t border-warm-sand pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-luxury-ink/50">
                  From
                </p>
                <p className="font-display text-2xl text-deep-aubergine">
                  {formatCents(effectivePrice, currency)}
                </p>
                {trip.depositCents > 0 && (
                  <p className="mt-0.5 font-sans text-xs text-luxury-ink/60">
                    {formatCents(trip.depositCents, currency)} deposit
                  </p>
                )}
              </div>

              {spotsLeft > 0 && trip.status !== "sold_out" && trip.status !== "completed" && (
                <p className="text-right font-sans text-xs text-emerald">
                  <span className="block font-semibold">{spotsLeft}</span>
                  <span className="text-luxury-ink/50">spots left</span>
                </p>
              )}
            </div>

            <Link
              href={`/trips/${trip.slug}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory transition-colors hover:bg-deep-aubergine"
            >
              View Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </article>
    </TripCardTilt>
  );
}
