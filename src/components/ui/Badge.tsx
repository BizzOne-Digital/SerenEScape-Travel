import { cn } from "@/lib/utils";
import type { TripStatus } from "@/types";

const statusConfig: Record<
  TripStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-luxury-ink/10 text-luxury-ink/60 border-luxury-ink/15",
  },
  coming_soon: {
    label: "Coming Soon",
    className: "bg-cobalt/12 text-cobalt border-cobalt/25",
  },
  booking_open: {
    label: "Booking Open",
    className: "bg-emerald/12 text-emerald border-emerald/30",
  },
  limited_spots: {
    label: "Limited Spots",
    className: "bg-marigold/15 text-burnt-orange border-marigold/35",
  },
  sold_out: {
    label: "Sold Out",
    className: "bg-rich-berry/12 text-rich-berry border-rich-berry/30",
  },
  waitlist: {
    label: "Waitlist",
    className: "bg-cobalt/10 text-deep-aubergine border-cobalt/20",
  },
  completed: {
    label: "Completed",
    className: "bg-muted-gold/15 text-muted-gold border-muted-gold/30",
  },
};

interface BadgeProps {
  status: TripStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status] ?? {
    label: status?.replace(/_/g, " ") ?? "Unknown",
    className: "bg-luxury-ink/10 text-luxury-ink/60 border-luxury-ink/15",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
