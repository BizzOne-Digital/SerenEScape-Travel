"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type TestimonialData = {
  _id?: string;
  name?: string;
  location?: string;
  tripTitle?: string;
  content: string;
  rating?: number;
};

interface TestimonialsSectionProps {
  testimonials: TestimonialData[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const hasTestimonials = testimonials.length > 0;

  function goTo(direction: "prev" | "next") {
    setActiveIndex((current) => {
      if (direction === "prev") {
        return current === 0 ? testimonials.length - 1 : current - 1;
      }
      return current === testimonials.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-soft-ivory to-warm-sand/40 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Voices From the Journey"
          align="center"
          className="mb-12"
        />

        {!hasTestimonials ? (
          <motion.div
            className="mx-auto max-w-lg rounded-2xl border border-dashed border-muted-gold/40 bg-soft-ivory/80 px-8 py-14 text-center"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Quote className="mx-auto mb-4 h-10 w-10 text-muted-gold/50" aria-hidden />
            <p className="font-display text-xl text-deep-aubergine/70">
              Stories from our community coming soon
            </p>
            <p className="mt-3 font-sans text-sm text-luxury-ink/50">
              Real traveler stories will appear here once approved.
            </p>
          </motion.div>
        ) : (
          <div className="relative mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={testimonials[activeIndex]._id ?? activeIndex}
                className="rounded-2xl border border-muted-gold/20 bg-soft-ivory p-8 shadow-sm sm:p-12"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Quote className="mb-6 h-8 w-8 text-rich-berry/30" aria-hidden />

                {testimonials[activeIndex].rating && (
                  <div className="mb-4 flex gap-1" aria-label={`${testimonials[activeIndex].rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < (testimonials[activeIndex].rating ?? 0)
                            ? "fill-marigold text-marigold"
                            : "text-muted-gold/30"
                        )}
                        aria-hidden
                      />
                    ))}
                  </div>
                )}

                <p className="font-display text-xl leading-relaxed text-deep-aubergine sm:text-2xl">
                  &ldquo;{testimonials[activeIndex].content}&rdquo;
                </p>

                <footer className="mt-8 border-t border-muted-gold/20 pt-6">
                  {testimonials[activeIndex].name && (
                    <cite className="font-sans text-base font-semibold not-italic text-luxury-ink">
                      {testimonials[activeIndex].name}
                    </cite>
                  )}
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-sans text-sm text-luxury-ink/60">
                    {testimonials[activeIndex].location && (
                      <span>{testimonials[activeIndex].location}</span>
                    )}
                    {testimonials[activeIndex].tripTitle && (
                      <span className="text-rich-berry">{testimonials[activeIndex].tripTitle}</span>
                    )}
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            {testimonials.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => goTo("prev")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-muted-gold/30 text-deep-aubergine transition-colors hover:bg-warm-sand/60"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
                  {testimonials.map((t, i) => (
                    <button
                      key={t._id ?? i}
                      type="button"
                      role="tab"
                      aria-selected={i === activeIndex}
                      aria-label={`Go to testimonial ${i + 1}`}
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === activeIndex ? "w-6 bg-rich-berry" : "w-2 bg-muted-gold/40"
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goTo("next")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-muted-gold/30 text-deep-aubergine transition-colors hover:bg-warm-sand/60"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
