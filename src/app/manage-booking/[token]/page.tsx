import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PaymentPortal } from "@/components/booking/PaymentPortal";
import { getSiteSettings } from "@/lib/site/queries";

export const metadata: Metadata = {
  title: "Booking Portal",
  description: "View and manage your SerenEScape Travel booking.",
};

interface PortalPageProps {
  params: Promise<{ token: string }>;
}

export default async function ManageBookingPortalPage({ params }: PortalPageProps) {
  const { token } = await params;
  const settings = await getSiteSettings();

  return (
    <section className="bg-soft-ivory py-28 sm:py-32">
      <Container>
        <div className="mb-10 text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-burnt-orange">
            Secure Portal
          </p>
          <h1 className="mt-2 font-display text-3xl text-deep-aubergine">Your Booking</h1>
        </div>

        <div className="mx-auto max-w-2xl">
          <PaymentPortal
            token={token}
            paypalEnabled={settings.paypalEnabled}
            squareEnabled={settings.squareEnabled}
          />
        </div>
      </Container>
    </section>
  );
}
