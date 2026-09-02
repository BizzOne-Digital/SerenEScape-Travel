import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your SerenEScape Travel booking confirmation.",
};

interface SuccessPageProps {
  searchParams: Promise<{
    reference?: string;
    verified?: string;
    provider?: string;
    orderId?: string;
  }>;
}

export default async function BookingSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const isVerified = params.verified === "true" && Boolean(params.reference);

  return (
    <>
      <PageHero
        variant={isVerified ? "dark" : "light"}
        eyebrow={isVerified ? "Confirmed" : "Payment Status"}
        title={isVerified ? "Thank You!" : "Unable to Verify Payment"}
        description={
          isVerified
            ? "Your payment has been received. A confirmation email will be sent shortly."
            : "We couldn't verify your payment from this link. Check your email or contact us for help."
        }
        compact
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-lg text-center">
          {isVerified ? (
            <>
              <CheckCircle className="mx-auto h-14 w-14 text-emerald" />
              <p className="mt-4 font-sans text-base text-luxury-ink/75">
                Your booking details and next steps are on the way to your inbox.
              </p>

              <div className="mt-8 rounded-2xl border border-muted-gold/20 bg-warm-sand/20 p-6 text-left">
                <dl className="space-y-3 font-sans text-sm">
                  <div className="flex justify-between">
                    <dt className="text-luxury-ink/60">Booking Reference</dt>
                    <dd className="font-medium text-deep-aubergine">{params.reference}</dd>
                  </div>
                  {params.provider && (
                    <div className="flex justify-between">
                      <dt className="text-luxury-ink/60">Payment Provider</dt>
                      <dd className="capitalize">{params.provider}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <p className="mt-6 font-sans text-xs text-luxury-ink/50">
                Payment confirmation is processed by our payment provider. If you have questions,
                contact us with your booking reference.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/manage-booking"
                  className="inline-flex items-center justify-center rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-deep-aubergine"
                >
                  Manage Booking
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-muted-gold/30 px-6 py-3 font-sans text-sm font-medium text-deep-aubergine hover:bg-warm-sand/50"
                >
                  Back to Home
                </Link>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="mx-auto h-14 w-14 text-burnt-orange" />
              <p className="mt-4 font-sans text-base text-luxury-ink/75">
                If you completed a payment, please check your email for confirmation or contact us
                for assistance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/manage-booking"
                  className="inline-flex items-center justify-center rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory"
                >
                  Look Up Booking
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-muted-gold/30 px-6 py-3 font-sans text-sm font-medium text-deep-aubergine"
                >
                  Contact Support
                </Link>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
    </>
  );
}
