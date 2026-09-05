"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import {
  Building2,
  Landmark,
  UsersRound,
  Clock,
  MapPin,
  CreditCard,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IMAGES, shouldUnoptimizeImage } from "@/config/images";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const highlights: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "Quality Accommodations",
    description: "Hand-selected hotels and stays that balance comfort, location, and character.",
  },
  {
    icon: Landmark,
    title: "Cultural Excursions",
    description: "Immersive experiences that connect you to local history, art, and traditions.",
  },
  {
    icon: UsersRound,
    title: "Welcoming Group Environment",
    description: "Travel with inspiring women who celebrate life together—your community from day one.",
  },
  {
    icon: Clock,
    title: "Thoughtfully Paced Itineraries",
    description: "Enough structure to feel supported, enough breathing room to savor each moment.",
  },
  {
    icon: MapPin,
    title: "Independent Exploration",
    description: "Optional free time built in so you can wander, rest, or discover on your own terms.",
  },
  {
    icon: CreditCard,
    title: "Payment Plan Options",
    description: "Reserve your spot with a deposit and spread the rest across scheduled installments.",
  },
  {
    icon: MessageCircle,
    title: "Dedicated Trip Communication",
    description: "Clear updates, pre-trip guidance, and support from booking through your return home.",
  },
];

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="relative overflow-hidden bg-deep-aubergine py-20 text-soft-ivory sm:py-28">
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-rich-berry/30 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-burnt-orange/20 blur-[100px]"
        aria-hidden
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="The SerenEScape Experience"
              title="Every Detail, Intentionally Designed"
              description="From where you rest your head to how you pay, we handle the details so you can focus on belonging."
              className="[&_h2]:text-soft-ivory [&_p]:text-soft-ivory/75 [&_.prismatic-line]:opacity-90"
            />

            <motion.div
              className="relative mt-10 aspect-[4/3] min-w-0 overflow-hidden rounded-2xl lg:hidden"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={IMAGES.experienceCommunity.src}
                alt={IMAGES.experienceCommunity.alt}
                fill
                unoptimized={shouldUnoptimizeImage(IMAGES.experienceCommunity.src)}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-aubergine/60 to-transparent" />
            </motion.div>

            <motion.div
              className="relative mt-10 hidden aspect-[4/3] min-w-0 overflow-hidden rounded-2xl lg:block"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={IMAGES.experienceLuxury.src}
                alt={IMAGES.experienceLuxury.alt}
                fill
                unoptimized={shouldUnoptimizeImage(IMAGES.experienceLuxury.src)}
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-aubergine/60 to-transparent" />
            </motion.div>
          </div>

          <ul className="space-y-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.title}
                  className="glass-panel-dark flex gap-4 rounded-xl p-5"
                  initial={reducedMotion ? false : { opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: reducedMotion ? 0 : 0.1 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-marigold/15 text-marigold">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-soft-ivory">{item.title}</h3>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-soft-ivory/70">{item.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
