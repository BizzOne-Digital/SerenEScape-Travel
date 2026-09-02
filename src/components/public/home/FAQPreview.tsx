"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type FAQData = {
  _id?: string;
  category: string;
  question: string;
  answer: string;
  order?: number;
};

interface FAQPreviewProps {
  faqs: FAQData[];
}

export function FAQPreview({ faqs }: FAQPreviewProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const topFaqs = faqs.slice(0, 5);

  return (
    <section ref={ref} className="bg-soft-ivory py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions? We've Got Answers."
              description="The essentials before you book. For everything else, our full FAQ has you covered."
            />
            <Button href="/faq" variant="outline" className="mt-8">
              View All FAQs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div className="lg:col-span-3">
            {topFaqs.length === 0 ? (
              <motion.p
                className="rounded-xl border border-dashed border-muted-gold/30 bg-warm-sand/20 px-6 py-10 text-center font-sans text-luxury-ink/60"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
              >
                FAQs will appear here once published.
              </motion.p>
            ) : (
              <div className="divide-y divide-muted-gold/20 rounded-2xl border border-muted-gold/20 bg-warm-sand/10">
                {topFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  const panelId = `faq-panel-${index}`;
                  const buttonId = `faq-button-${index}`;

                  return (
                    <motion.div
                      key={faq._id ?? index}
                      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: reducedMotion ? 0 : index * 0.06,
                      }}
                    >
                      <h3>
                        <button
                          id={buttonId}
                          type="button"
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-warm-sand/30"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                        >
                          <span className="font-display text-lg font-medium text-deep-aubergine">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 shrink-0 text-rich-berry transition-transform duration-300",
                              isOpen && "rotate-180"
                            )}
                            aria-hidden
                          />
                        </button>
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: reducedMotion ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="px-6 pb-5 font-sans text-sm leading-relaxed text-luxury-ink/75 sm:text-base">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {topFaqs.length > 0 && (
              <p className="mt-6 text-center lg:text-left">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1 font-sans text-sm font-medium text-rich-berry transition-colors hover:text-deep-aubergine"
                >
                  See more answers
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
