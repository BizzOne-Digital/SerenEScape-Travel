"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Compass,
  Sun,
  Mountain,
  Landmark,
  Leaf,
  Sparkles,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { PageContent } from "@/lib/content/defaults";
import { formatCents } from "@/lib/pricing";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export interface HeroFeaturedTrip {
  slug: string;
  title: string;
  durationDays: number;
  groupMin: number;
  groupMax: number;
  priceFromCents: number;
  currency?: string;
}

// Positions/icons are fixed design slots; the admin edits the text of up to 3 of each.
const PILL_SLOTS = [
  { icon: Mountain, className: "top-[22%] left-[38%] md:left-[42%] lg:left-[44%]" },
  { icon: Landmark, className: "top-[34%] right-[8%] md:right-[12%]" },
  { icon: Leaf, className: "bottom-[38%] right-[14%] md:right-[18%]" },
] as const;

const WATERMARK_SLOTS = [
  "top-[18%] left-[32%] md:left-[36%]",
  "top-[16%] right-[6%] md:right-[10%]",
  "bottom-[28%] left-[30%] md:left-[34%]",
] as const;

interface HeroSectionProps {
  featuredTrip?: HeroFeaturedTrip | null;
  content: PageContent<"home">["hero"];
  tagline: string;
}

export function HeroSection({ featuredTrip, content, tagline }: HeroSectionProps) {
  const reducedMotion = useReducedMotion();
  const trip = featuredTrip ?? null;
  const floatingPills = content.pills
    .slice(0, PILL_SLOTS.length)
    .map((p, i) => ({ label: p.text, icon: PILL_SLOTS[i].icon, className: PILL_SLOTS[i].className }));
  const watermarks = content.watermarks
    .slice(0, WATERMARK_SLOTS.length)
    .map((w, i) => ({ text: w.text, className: WATERMARK_SLOTS[i] }));

  return (
    <section
      className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-soft-ivory"
      aria-label="Hero"
    >
      {/* Background image — landscape only, no people */}
      <div className="absolute inset-0">
        <SafeImage
          src={content.image.url}
          alt={content.image.alt}
          fill
          priority
          className="object-cover object-[65%_center] md:object-[70%_center]"
          sizes="100vw"
        />
        {/* Left readability gradient matching mockup */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-soft-ivory via-soft-ivory/92 to-soft-ivory/10 md:from-soft-ivory md:via-soft-ivory/75 md:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-soft-ivory/40 via-transparent to-soft-ivory/20"
          aria-hidden
        />
      </div>

      {/* Watermark stamps */}
      {watermarks.map((wm) => (
        <div
          key={wm.text}
          className={cn(
            "pointer-events-none absolute z-10 hidden select-none rounded-full border border-deep-aubergine/10 px-4 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-deep-aubergine/25 md:block",
            wm.className
          )}
          aria-hidden
        >
          {wm.text}
        </div>
      ))}

      {/* Floating destination pills */}
      {floatingPills.map((pill, i) => {
        const Icon = pill.icon;
        return (
          <motion.div
            key={pill.label}
            className={cn(
              "pointer-events-none absolute z-20 hidden items-center gap-2 rounded-full border border-white/50 bg-white/25 px-4 py-2 shadow-lg backdrop-blur-md sm:flex",
              pill.className
            )}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.6 }}
          >
            <Icon className="h-3.5 w-3.5 text-deep-aubergine" strokeWidth={2} />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-deep-aubergine">
              {pill.label}
            </span>
          </motion.div>
        );
      })}

      {/* Main content — left aligned */}
      <Container className="relative z-30 flex min-h-[calc(100svh-8rem)] flex-col justify-center pb-44 pt-6 sm:pb-40 md:pb-32 md:pt-10">
        <div className="max-w-xl min-w-0 lg:max-w-2xl">
          <motion.p
            className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-deep-aubergine/80 sm:text-xs"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {content.eyebrow}
          </motion.p>

          <motion.h1
            className="font-display text-[2.35rem] font-medium leading-[1.08] text-deep-aubergine sm:text-5xl md:text-[3.25rem] lg:text-6xl"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65 }}
          >
            {content.headlineLine1}
            <br />
            <span className="text-rich-berry">{content.headlineLine2}</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg font-sans text-base leading-relaxed text-luxury-ink/75 sm:text-lg"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6 }}
          >
            {content.supporting}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.6 }}
          >
            <Link
              href={content.primaryCtaHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-deep-aubergine via-rich-berry to-deep-aubergine px-5 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-soft-ivory shadow-lg shadow-deep-aubergine/25 transition hover:shadow-xl hover:brightness-110 sm:w-auto sm:px-7 sm:text-xs sm:tracking-[0.14em]"
            >
              <Compass className="h-4 w-4 text-marigold" />
              {content.primaryCtaLabel}
            </Link>
            <Link
              href={content.secondaryCtaHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-muted-gold/70 bg-soft-ivory/60 px-5 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-deep-aubergine backdrop-blur-sm transition hover:border-muted-gold hover:bg-warm-sand/50 sm:w-auto sm:px-7 sm:text-xs sm:tracking-[0.14em]"
            >
              <Sun className="h-4 w-4 text-burnt-orange" />
              {content.secondaryCtaLabel}
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 md:mt-12"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Sparkles className="h-5 w-5 shrink-0 text-marigold" />
              <p className="min-w-0 font-sans text-xs font-bold uppercase tracking-[0.14em] text-deep-aubergine sm:text-sm sm:tracking-[0.22em]">
                {tagline}
              </p>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Featured trip card — bottom right (only when a trip is marked Featured in the admin) */}
      {trip && (
      <motion.div
        className="absolute bottom-6 left-4 right-4 z-30 sm:left-auto sm:right-8 sm:max-w-sm lg:right-12"
        initial={reducedMotion ? false : { opacity: 0, x: 24, y: 12 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7 }}
      >
        <Link
          href={`/trips/${trip.slug}`}
          className="group flex w-full min-w-0 items-center gap-3 rounded-2xl border border-muted-gold/40 bg-gradient-to-br from-deep-aubergine/95 via-rich-berry/90 to-deep-aubergine/95 p-4 shadow-2xl shadow-deep-aubergine/30 backdrop-blur-md transition hover:border-muted-gold/70 sm:gap-4 sm:p-5 md:hover:scale-[1.02]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-muted-gold/50 bg-muted-gold/15 sm:h-12 sm:w-12">
            <Landmark className="h-5 w-5 text-marigold sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-marigold/90">
              {content.featuredLabel}
            </p>
            <p className="truncate font-display text-base font-medium leading-tight text-soft-ivory sm:text-lg md:text-xl">
              {trip.title}
            </p>
            <p className="mt-0.5 font-sans text-xs text-soft-ivory/70">
              {trip.durationDays} days · {trip.groupMin}–{trip.groupMax} women
            </p>
            <p className="mt-1 font-sans text-sm font-semibold text-marigold">
              From {formatCents(trip.priceFromCents, trip.currency ?? "USD")}
            </p>
          </div>
        </Link>
      </motion.div>
      )}

      {/* Mobile floating pills */}
      <div className="absolute bottom-[11.5rem] left-4 right-4 z-20 flex flex-wrap justify-center gap-2 sm:hidden">
        {floatingPills.map((pill) => (
          <span
            key={pill.label}
            className="rounded-full border border-white/40 bg-white/30 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-deep-aubergine backdrop-blur-sm"
          >
            {pill.label}
          </span>
        ))}
      </div>

      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-60" aria-hidden />
    </section>
  );
}
