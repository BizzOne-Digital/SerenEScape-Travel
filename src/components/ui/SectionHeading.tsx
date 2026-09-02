import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-burnt-orange">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="break-words font-display text-3xl font-medium leading-tight text-deep-aubergine sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 font-sans text-base leading-relaxed text-luxury-ink/75 sm:text-lg">
          {description}
        </p>
      )}
      <div
        className={cn(
          "prismatic-line mt-6 w-16",
          align === "center" && "mx-auto"
        )}
        aria-hidden
      />
    </div>
  );
}
