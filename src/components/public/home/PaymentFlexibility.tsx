"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Wallet,
  CalendarClock,
  Link2,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PageContent } from "@/lib/content/defaults";

const ICONS = [Wallet, CalendarClock, Link2, Percent, ShieldCheck];

export function PaymentFlexibility({ content }: { content: PageContent<"home">["payment"] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="bg-deep-aubergine py-20 text-soft-ivory sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
          className="mb-14 [&_h2]:text-soft-ivory [&_p]:text-soft-ivory/70"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((feature, index) => {
            const Icon = ICONS[index % ICONS.length];
            const isLast = index === content.items.length - 1;

            return (
              <motion.div
                key={feature.title}
                className={`rounded-xl border border-muted-gold/15 bg-soft-ivory/5 p-6 backdrop-blur-sm ${
                  isLast ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: reducedMotion ? 0 : index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-marigold/15 text-marigold">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="font-display text-lg font-medium text-soft-ivory">{feature.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-soft-ivory/65">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="mx-auto mt-10 max-w-2xl text-center font-sans text-xs leading-relaxed text-soft-ivory/50"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: reducedMotion ? 0 : 0.5 }}
        >
          {content.disclaimer}
        </motion.p>

        <div className="mt-8 flex items-center justify-center gap-6 font-sans text-sm font-semibold tracking-wide text-soft-ivory/80">
          <span className="rounded-lg border border-soft-ivory/20 px-4 py-2">PayPal</span>
          <span className="text-soft-ivory/30" aria-hidden>
            ·
          </span>
          <span className="rounded-lg border border-soft-ivory/20 px-4 py-2">Square</span>
        </div>
      </Container>
    </section>
  );
}
