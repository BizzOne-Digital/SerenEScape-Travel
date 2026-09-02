"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type Promotion = {
  _id?: string;
  code: string;
  publicDescription?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate?: string;
  endDate?: string;
  homepageBanner?: boolean;
};

interface AnnouncementBannerProps {
  promotions?: Promotion[];
}

function isPromotionActive(promo: Promotion, now: Date): boolean {
  const start = promo.startDate ? new Date(promo.startDate) : null;
  const end = promo.endDate ? new Date(promo.endDate) : null;
  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

function formatPromotionMessage(promo: Promotion): string {
  if (promo.publicDescription) return promo.publicDescription;
  if (promo.discountType === "percentage") {
    return `Save ${promo.discountValue}% with code ${promo.code}`;
  }
  return `Save $${(promo.discountValue / 100).toFixed(0)} with code ${promo.code}`;
}

export function AnnouncementBanner({ promotions: promotionsProp }: AnnouncementBannerProps) {
  const reducedMotion = useReducedMotion();
  const [fetchedPromotions, setFetchedPromotions] = useState<Promotion[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const promotions = promotionsProp ?? fetchedPromotions;

  useEffect(() => {
    if (promotionsProp) return;

    let cancelled = false;

    async function fetchPromotions() {
      try {
        const response = await fetch("/api/promotions/active");
        if (!response.ok) return;
        const data = (await response.json()) as { promotions?: Promotion[] };
        if (!cancelled && data.promotions) {
          setFetchedPromotions(data.promotions);
        }
      } catch {
        // Silently fail — banner is non-critical
      }
    }

    fetchPromotions();
    return () => {
      cancelled = true;
    };
  }, [promotionsProp]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const activePromotion = useMemo(
    () => promotions.find((promo) => isPromotionActive(promo, now)),
    [promotions, now]
  );

  const visible = Boolean(activePromotion) && !dismissed;

  return (
    <AnimatePresence>
      {visible && activePromotion && (
        <motion.div
          role="region"
          aria-label="Promotion announcement"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 overflow-hidden"
        >
          <div className="gradient-aubergine relative">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 pr-12 sm:px-6 sm:pr-14 lg:px-8">
              <Sparkles className="hidden h-4 w-4 shrink-0 text-marigold sm:block" aria-hidden />
              <p className="min-w-0 text-balance text-center font-sans text-xs font-medium leading-snug text-soft-ivory sm:text-sm">
                <span className="mr-2 hidden font-semibold uppercase tracking-wider text-marigold sm:inline">
                  Limited Offer
                </span>
                {formatPromotionMessage(activePromotion)}
                <Link
                  href="/trips"
                  className={cn(
                    "ml-2 inline font-semibold underline decoration-marigold/60 underline-offset-2",
                    "transition-colors hover:text-marigold"
                  )}
                >
                  Explore trips
                </Link>
              </p>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-soft-ivory/70 transition-colors hover:bg-soft-ivory/10 hover:text-soft-ivory"
                aria-label="Dismiss announcement"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="prismatic-line h-0.5 w-full opacity-80" aria-hidden />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
