"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import type { PageContent } from "@/lib/content/defaults";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Destination = PageContent<"home">["destinations"]["items"][number];

export function DestinationStory({ content }: { content: PageContent<"home">["destinations"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-soft-ivory py-20 sm:py-28">
      <Container>
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-burnt-orange">
            {content.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-medium leading-tight text-deep-aubergine sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <div className="prismatic-line mt-6 w-16" aria-hidden />
          <p className="mt-6 font-sans text-base leading-relaxed text-luxury-ink/75 sm:text-lg">
            {content.description}
          </p>
        </div>

        <div className="divide-y divide-warm-sand/80">
          {content.items.map((dest, index) => (
            <DestinationPanel
              key={`${dest.city}-${index}`}
              dest={dest}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function DestinationPanel({
  dest,
  index,
  reducedMotion,
}: {
  dest: Destination;
  index: number;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-center gap-8 py-16 first:pt-0 last:pb-0 sm:gap-10 lg:grid-cols-2 lg:gap-16 lg:py-20",
        !isEven && "lg:[&>*:first-child]:order-2"
      )}
    >
      <motion.div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-luxury-ink/10"
        initial={reducedMotion ? false : { opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <SafeImage
          src={dest.image.url}
          alt={dest.image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-deep-aubergine/20 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald">
          {dest.theme}
        </p>
        <h3 className="mt-2 font-display text-2xl font-medium text-deep-aubergine sm:text-3xl">
          {dest.city}
        </h3>
        <p className="mt-1 font-sans text-sm text-muted-gold">{dest.region}</p>
        <div className="prismatic-line mt-5 w-12" aria-hidden />
        <p className="mt-5 font-sans text-base leading-relaxed text-luxury-ink/80">{dest.copy}</p>
      </motion.div>
    </div>
  );
}
