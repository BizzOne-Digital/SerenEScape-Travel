"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BelongSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="relative overflow-hidden bg-soft-ivory py-20 sm:py-28">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-rich-berry/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-emerald/5 blur-3xl"
        aria-hidden
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-5"
            initial={reducedMotion ? false : { opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading
              eyebrow="Our Story"
              title="Belong Everywhere."
              description="Founded by two Black LGBTQIA+ women who believe travel should be a celebration of who we are, not a compromise."
            />
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: reducedMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative rounded-2xl border border-muted-gold/20 bg-warm-sand/30 p-8 sm:p-10">
              <div className="prismatic-line absolute left-8 top-0 w-24 -translate-y-px sm:left-10" aria-hidden />

              <div className="space-y-6 font-sans text-base leading-relaxed text-luxury-ink/85 sm:text-lg">
                <p>
                  SerenEScape Travel creates spaces where Black women and LGBTQIA+ travelers can explore
                  the world on our terms—with safety, luxury, and sisters who get it by our side.
                </p>
                <p>
                  We curate transformative journeys that honor all your intersections. You get the freedom
                  to explore independently while being held by a community where your full self is
                  celebrated. No explanations needed. No shrinking. Just authentic adventure, queer joy,
                  and genuine belonging.
                </p>
              </div>

              <div className="gold-line my-8" aria-hidden />

              <p className="font-display text-lg italic text-deep-aubergine/80">
                Women allies who share our values are welcome too.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
