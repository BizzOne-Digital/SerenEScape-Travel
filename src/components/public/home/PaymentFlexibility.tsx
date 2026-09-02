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
import { BRAND } from "@/config/brand";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const paymentFeatures = [
  {
    icon: Wallet,
    title: "Reserve with a Deposit",
    description: "Secure your spot with a required deposit—your journey begins the moment you commit.",
  },
  {
    icon: CalendarClock,
    title: "Scheduled Installments",
    description: "Spread remaining payments across a clear schedule with due dates you can plan around.",
  },
  {
    icon: Link2,
    title: "Secure Booking Link",
    description: "Pay your balance anytime through your personal, secure traveler portal.",
  },
  {
    icon: Percent,
    title: `${BRAND.payInFullDiscountPercent}% Pay-in-Full Discount`,
    description: `Choose to pay in full at booking and receive an automatic ${BRAND.payInFullDiscountPercent}% discount on your trip total.`,
  },
  {
    icon: ShieldCheck,
    title: "PayPal & Square",
    description: "Trusted payment providers—never store card details on our servers.",
  },
] as const;

export function PaymentFlexibility() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="bg-deep-aubergine py-20 text-soft-ivory sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Payment Flexibility"
          title="Invest in Your Journey, Your Way"
          description="We believe extraordinary travel should be accessible—not locked behind a single payment deadline."
          align="center"
          className="mb-14 [&_h2]:text-soft-ivory [&_p]:text-soft-ivory/70"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paymentFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isLast = index === paymentFeatures.length - 1;

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
          Installment payments are made through secure links when due—not automatically charged unless
          you have explicitly opted into a configured auto-pay program.
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
