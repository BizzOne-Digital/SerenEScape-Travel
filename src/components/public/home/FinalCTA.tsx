"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/config/brand";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="gradient-aubergine absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-marigold/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald/15 blur-[120px]"
        aria-hidden
      />

      <Container className="relative text-center">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sparkles className="mx-auto mb-6 h-8 w-8 text-marigold" aria-hidden />

          <h2 className="mx-auto max-w-3xl font-display text-3xl font-medium leading-tight text-soft-ivory sm:text-4xl lg:text-5xl">
            Your next journey should feel like freedom.
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-soft-ivory/80 sm:text-lg">
            Come for the destination. Stay for the community.{" "}
            <span className="font-medium text-marigold">{BRAND.tagline}</span>
          </p>

          <div className="prismatic-line mx-auto mt-8 w-24 opacity-90" aria-hidden />

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/trips" variant="secondary" size="lg">
              Explore Trips
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Button>
            <Button
              href="/contact?type=custom-group"
              variant="outline"
              size="lg"
              className="border-soft-ivory/40 text-soft-ivory hover:bg-soft-ivory/10"
            >
              Plan a Custom Group Experience
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
