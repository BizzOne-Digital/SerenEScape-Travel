import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/shared/PageHero";
import { ManageBookingLookup } from "@/components/booking/ManageBookingLookup";

export const metadata: Metadata = {
  title: "Manage Booking",
  description: "Look up your SerenEScape Travel booking by reference and email.",
};

export default function ManageBookingPage() {
  return (
    <>
      <PageHero
        variant="light"
        eyebrow="Your Booking"
        title="Manage Your Booking"
        description="Enter your booking reference and email to view your reservation, make payments, and update details."
        watermark="Secure Access"
      />

      <section className="bg-soft-ivory py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-md rounded-2xl border border-muted-gold/20 bg-warm-sand/10 p-6 sm:p-8">
            <ManageBookingLookup />
          </div>

          <p className="mx-auto mt-8 max-w-md text-center font-sans text-xs text-luxury-ink/50">
            Your booking reference was included in your confirmation email. If you need help,
            please contact our team.
          </p>
        </Container>
      </section>
    </>
  );
}
