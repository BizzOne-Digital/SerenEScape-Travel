import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { shouldUnoptimizeImage } from "@/config/images";

export type PageHeroVariant = "light" | "dark" | "image";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  /** @deprecated Use variant="dark" instead */
  dark?: boolean;
  variant?: PageHeroVariant;
  imageSrc?: string;
  imageAlt?: string;
  align?: "center" | "left";
  compact?: boolean;
  watermark?: string;
}

function HeroWave({ className }: { className?: string }) {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10" aria-hidden>
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className={cn("h-10 w-full sm:h-14", className)}
      >
        <path d="M0,40 C320,56 640,24 960,40 C1200,52 1320,48 1440,40 L1440,56 L0,56 Z" />
      </svg>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  dark = false,
  variant,
  imageSrc,
  imageAlt,
  align = "center",
  compact = false,
  watermark,
}: PageHeroProps) {
  const resolvedVariant: PageHeroVariant =
    variant ?? (imageSrc ? "image" : dark ? "dark" : "light");

  const isDark = resolvedVariant === "dark" || resolvedVariant === "image";
  const waveFill = isDark ? "fill-soft-ivory" : "fill-soft-ivory";

  return (
    <section
      className={cn(
        "page-hero relative w-full max-w-full overflow-x-clip",
        compact ? "pt-24 pb-16 sm:pt-28 sm:pb-20" : "min-h-[42vh] pt-28 pb-20 sm:pt-32 sm:pb-24",
        resolvedVariant === "light" && "bg-gradient-to-br from-warm-sand/50 via-soft-ivory to-warm-sand/30",
        resolvedVariant === "dark" && "gradient-aubergine text-soft-ivory",
        resolvedVariant === "image" && "text-soft-ivory",
        className
      )}
    >
      {resolvedVariant === "image" && imageSrc && (
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            priority
            unoptimized={shouldUnoptimizeImage(imageSrc)}
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-ink/85 via-deep-aubergine/75 to-luxury-ink/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/70 via-transparent to-luxury-ink/25" />
        </div>
      )}

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {resolvedVariant === "light" ? (
          <>
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-rich-berry/8 blur-[90px]" />
            <div className="absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-burnt-orange/10 blur-[80px]" />
            <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald/8 blur-[70px]" />
          </>
        ) : (
          <>
            <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-rich-berry/35 blur-[100px]" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-burnt-orange/25 blur-[90px]" />
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold/10 blur-[80px]" />
          </>
        )}
      </div>

      {watermark && (
        <p
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 select-none font-sans text-[10px] font-bold uppercase tracking-[0.35em] lg:right-12 lg:block",
            isDark ? "text-soft-ivory/10" : "text-deep-aubergine/8"
          )}
          aria-hidden
        >
          {watermark}
        </p>
      )}

      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      <Container className="relative z-20">
        <div
          className={cn(
            "page-hero-content max-w-3xl",
            align === "center" ? "mx-auto text-center" : "text-left"
          )}
        >
          {eyebrow && (
            <p
              className={cn(
                "mb-4 inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.28em]",
                isDark ? "text-marigold" : "text-burnt-orange"
              )}
            >
              <span
                className={cn(
                  "h-px w-6",
                  isDark ? "bg-marigold/60" : "bg-burnt-orange/50",
                  align === "center" && "hidden sm:inline-block"
                )}
                aria-hidden
              />
              {eyebrow}
              <span
                className={cn(
                  "h-px w-6",
                  isDark ? "bg-marigold/60" : "bg-burnt-orange/50",
                  align === "center" && "hidden sm:inline-block"
                )}
                aria-hidden
              />
            </p>
          )}

          <h1
            className={cn(
              "break-words font-display text-[2rem] font-medium leading-[1.08] sm:text-5xl lg:text-6xl",
              isDark ? "text-soft-ivory" : "text-deep-aubergine"
            )}
          >
            {title}
          </h1>

          {description && (
            <p
              className={cn(
                "mt-5 max-w-2xl font-sans text-base leading-relaxed sm:text-lg",
                align === "center" && "mx-auto",
                isDark ? "text-soft-ivory/82" : "text-luxury-ink/75"
              )}
            >
              {description}
            </p>
          )}

          <div
            className={cn(
              "prismatic-line mt-8 h-[3px] w-24",
              align === "center" ? "mx-auto" : "",
              isDark && "opacity-90"
            )}
            aria-hidden
          />
        </div>
      </Container>

      <HeroWave className={waveFill} />
    </section>
  );
}
