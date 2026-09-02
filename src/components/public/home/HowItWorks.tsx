"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { Search, Bookmark, CreditCard, Users, Plane } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const steps = [
  {
    icon: Search,
    title: "Find Your Escape",
    description: "Browse upcoming journeys and discover the destination that calls to you.",
  },
  {
    icon: Bookmark,
    title: "Reserve Your Place",
    description: "Secure your spot with a deposit and complete your traveler details.",
  },
  {
    icon: CreditCard,
    title: "Choose Your Payment Option",
    description: "Pay in full for 5% off, or spread payments across a flexible installment plan.",
  },
  {
    icon: Users,
    title: "Meet Your Community",
    description: "Connect with fellow travelers before departure through our trip communication.",
  },
  {
    icon: Plane,
    title: "Travel and Belong Everywhere",
    description: "Embark on your journey—explore boldly, experience deeply, belong fully.",
  },
] as const;

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="bg-warm-sand/30 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Your Journey Starts Here"
          description="From discovery to departure, we've made every step clear and supported."
          align="center"
          className="mb-16"
        />

        <div ref={timelineRef} className="relative mx-auto max-w-2xl">
          <div
            className="absolute left-6 top-0 h-full w-px bg-muted-gold/30 sm:left-8"
            aria-hidden
          />

          {!reducedMotion && (
            <motion.div
              className="absolute left-6 top-0 w-px origin-top bg-gradient-to-b from-burnt-orange via-emerald to-rich-berry sm:left-8"
              style={{ height: lineHeight }}
              aria-hidden
            />
          )}

          <ol className="space-y-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  className="relative flex gap-6 pl-2 sm:gap-8"
                  initial={reducedMotion ? false : { opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: reducedMotion ? 0 : index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-muted-gold/40 bg-soft-ivory shadow-sm sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 text-rich-berry sm:h-6 sm:w-6" strokeWidth={1.5} aria-hidden />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-deep-aubergine font-sans text-[10px] font-bold text-soft-ivory">
                      {index + 1}
                    </span>
                  </div>

                  <div className="pt-1">
                    <h3 className="font-display text-xl font-medium text-deep-aubergine sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-luxury-ink/70 sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
