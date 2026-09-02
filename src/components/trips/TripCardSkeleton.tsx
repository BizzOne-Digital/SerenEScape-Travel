import { cn } from "@/lib/utils";

export function TripCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-muted-gold/20 bg-soft-ivory",
        className
      )}
      aria-hidden
    >
      <div className="aspect-[4/3] animate-pulse bg-warm-sand/60" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 h-4 w-full animate-pulse rounded bg-warm-sand/60" />
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-warm-sand/60" />
        <div className="mb-5 space-y-2.5">
          <div className="h-3 w-2/3 animate-pulse rounded bg-warm-sand/50" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-warm-sand/50" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-warm-sand/50" />
        </div>
        <div className="mt-auto border-t border-warm-sand pt-5">
          <div className="h-8 w-24 animate-pulse rounded bg-warm-sand/60" />
          <div className="mt-5 h-12 w-full animate-pulse rounded-full bg-warm-sand/60" />
        </div>
      </div>
    </div>
  );
}
