"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ImageIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SafeImage } from "@/components/ui/SafeImage";
import { IMAGES } from "@/config/images";
import type { PageContent } from "@/lib/content/defaults";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type FounderData = {
  _id?: string;
  name?: string;
  title?: string;
  bio?: string;
  welcomeNote?: string;
  image?: { url: string; alt: string };
  order?: number;
  isPlaceholder?: boolean;
};

interface FoundersSectionProps {
  founders: FounderData[];
  content: PageContent<"home">["founders"];
}

export function FoundersSection({ founders, content }: FoundersSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();

  const sorted = [...founders].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const displayFounders = sorted.length > 0 ? sorted : [{ isPlaceholder: true }];

  return (
    <section ref={ref} className="bg-soft-ivory py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
          className="mb-14"
        />

        <div
          className={cn(
            "grid gap-10",
            displayFounders.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-lg"
          )}
        >
          {displayFounders.map((founder, index) => (
            <motion.article
              key={founder._id ?? `placeholder-${index}`}
              className="overflow-hidden rounded-2xl border border-muted-gold/20 bg-warm-sand/20"
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: reducedMotion ? 0 : index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {founder.isPlaceholder ? (
                <PlaceholderCard note={content.emptyNote} />
              ) : (
                <FounderCard founder={founder} />
              )}
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PlaceholderCard({ note }: { note: string }) {
  return (
    <div className="p-8 text-center">
      <div className="relative mx-auto mb-6 aspect-square w-48 overflow-hidden rounded-2xl border-2 border-dashed border-burnt-orange/40 bg-warm-sand/50">
        <SafeImage
          src={IMAGES.founderPlaceholder.src}
          alt={IMAGES.founderPlaceholder.alt}
          fill
          className="object-cover opacity-60"
          sizes="192px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-luxury-ink/40 p-4">
          <ImageIcon className="mb-2 h-8 w-8 text-marigold" aria-hidden />
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-marigold">
            Dev Placeholder
          </p>
        </div>
      </div>

      <p className="rounded-lg border border-burnt-orange/30 bg-burnt-orange/10 px-4 py-3 font-sans text-sm font-medium text-burnt-orange">
        {note}
      </p>
    </div>
  );
}

function FounderCard({ founder }: { founder: FounderData }) {
  const imageUrl = founder.image?.url || IMAGES.founderPlaceholder.src;
  const imageAlt = founder.image?.alt || founder.name || "Founder photograph";

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden">
        <SafeImage
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-aubergine/70 via-transparent to-transparent" />
      </div>

      <div className="p-6 sm:p-8">
        {founder.name && (
          <h3 className="font-display text-2xl font-medium text-deep-aubergine">{founder.name}</h3>
        )}
        {founder.title && (
          <p className="mt-1 font-sans text-sm font-medium text-rich-berry">{founder.title}</p>
        )}
        {founder.bio && (
          <p className="mt-4 font-sans text-sm leading-relaxed text-luxury-ink/75">{founder.bio}</p>
        )}
        {founder.welcomeNote && (
          <blockquote className="mt-5 border-l-2 border-muted-gold pl-4 font-display text-base italic text-deep-aubergine/80">
            &ldquo;{founder.welcomeNote}&rdquo;
          </blockquote>
        )}
      </div>
    </div>
  );
}
