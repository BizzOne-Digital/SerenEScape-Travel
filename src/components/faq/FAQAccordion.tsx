"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { FAQData } from "@/components/public/home/FAQPreview";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  booking: "Booking",
  payment: "Payment",
  travel: "Travel & Preparation",
  community: "Community",
  safety: "Safety & Support",
};

function formatCategory(category: string): string {
  return (
    CATEGORY_LABELS[category] ??
    category.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

interface FAQAccordionProps {
  faqs: FAQData[];
  groupByCategory?: boolean;
}

export function FAQAccordion({ faqs, groupByCategory = true }: FAQAccordionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (faqs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-muted-gold/40 bg-warm-sand/20 px-8 py-14 text-center">
        <p className="font-display text-xl text-deep-aubergine/70">FAQs coming soon</p>
        <p className="mt-3 font-sans text-sm text-luxury-ink/60">
          Check back soon or contact us with your questions.
        </p>
      </div>
    );
  }

  if (!groupByCategory) {
    return (
      <div ref={ref} className="divide-y divide-muted-gold/20 rounded-2xl border border-muted-gold/20 bg-soft-ivory">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq._id ?? index}
            faq={faq}
            itemKey={`${faq._id ?? index}`}
            isOpen={openKey === `${faq._id ?? index}`}
            onToggle={() =>
              setOpenKey(openKey === `${faq._id ?? index}` ? null : `${faq._id ?? index}`)
            }
            inView={inView}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    );
  }

  const categories = [...new Set(faqs.map((f) => f.category))].sort();

  return (
    <div ref={ref} className="space-y-10">
      {categories.map((category) => {
        const categoryFaqs = faqs.filter((f) => f.category === category);
        return (
          <div key={category}>
            <h2 className="mb-4 font-display text-2xl text-deep-aubergine">
              {formatCategory(category)}
            </h2>
            <div className="divide-y divide-muted-gold/20 rounded-2xl border border-muted-gold/20 bg-soft-ivory">
              {categoryFaqs.map((faq, index) => {
                const key = `${category}-${faq._id ?? index}`;
                return (
                  <FAQItem
                    key={key}
                    faq={faq}
                    itemKey={key}
                    isOpen={openKey === key}
                    onToggle={() => setOpenKey(openKey === key ? null : key)}
                    inView={inView}
                    index={index}
                    reducedMotion={reducedMotion}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FAQItem({
  faq,
  itemKey,
  isOpen,
  onToggle,
  inView,
  index,
  reducedMotion,
}: {
  faq: FAQData;
  itemKey: string;
  isOpen: boolean;
  onToggle: () => void;
  inView: boolean;
  index: number;
  reducedMotion: boolean;
}) {
  const panelId = `faq-${itemKey}`;
  const buttonId = `faq-btn-${itemKey}`;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: reducedMotion ? 0 : index * 0.04 }}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-warm-sand/30"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="min-w-0 break-words text-left font-display text-lg font-medium text-deep-aubergine">
            {faq.question}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-rich-berry transition-transform duration-300",
              isOpen && "rotate-180"
            )}
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
            transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
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
}
