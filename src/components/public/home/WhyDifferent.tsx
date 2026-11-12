"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Heart,
  Globe2,
  Gem,
  Users,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PageContent } from "@/lib/content/defaults";
import { cn } from "@/lib/utils";

// Icons and hover colours are design slots that repeat; text comes from the admin.
const SLOTS: { icon: LucideIcon; accent: string }[] = [
  { icon: Heart, accent: "from-rich-berry/20 to-burnt-orange/10" },
  { icon: Globe2, accent: "from-emerald/20 to-cobalt/10" },
  { icon: Gem, accent: "from-muted-gold/25 to-marigold/10" },
  { icon: Users, accent: "from-cobalt/20 to-rich-berry/10" },
  { icon: Compass, accent: "from-burnt-orange/20 to-emerald/10" },
];

export function WhyDifferent({ content }: { content: PageContent<"home">["why"] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="bg-gradient-to-b from-warm-sand/40 to-soft-ivory py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
          className="mb-14"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((pillar, index) => {
            const slot = SLOTS[index % SLOTS.length];
            const Icon = slot.icon;
            const isLast = index === content.items.length - 1;

            return (
              <motion.article
                key={pillar.title}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-muted-gold/15 bg-soft-ivory p-7 shadow-sm shadow-luxury-ink/5 transition-shadow hover:shadow-md hover:shadow-rich-berry/10",
                  isLast && "sm:col-span-2 lg:col-span-1"
                )}
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.55,
                  delay: reducedMotion ? 0 : index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    slot.accent
                  )}
                  aria-hidden
                />

                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-aubergine/5 text-rich-berry transition-colors group-hover:bg-rich-berry/10">
                    <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-medium text-deep-aubergine">{pillar.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-luxury-ink/70 sm:text-base">
                    {pillar.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
