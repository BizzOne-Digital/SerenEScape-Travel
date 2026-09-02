import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Cancelled",
  description: "Your booking payment was cancelled.",
};

interface CancelledPageProps {
  searchParams: Promise<{ reference?: string }>;
}

export default async function BookingCancelledPage({ searchParams }: CancelledPageProps) {
  const params = await searchParams;

  return (
    <>
      <PageHero
        variant="light"
        eyebrow="Booking"
        title="Payment Cancelled"
        description="Your payment was not completed. Your spot hasn't been confirmed and you haven't been charged."
        compact
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-lg text-center">
          <XCircle className="mx-auto h-14 w-14 text-rich-berry/70" />

          {params.reference && (
            <p className="mt-4 font-sans text-sm text-luxury-ink/60">
              Reference: <span className="font-medium">{params.reference}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-deep-aubergine"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-muted-gold/30 px-6 py-3 font-sans text-sm font-medium text-deep-aubergine hover:bg-warm-sand/50"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </Container>
    </section>
    </>
  );
}
