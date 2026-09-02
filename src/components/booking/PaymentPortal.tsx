"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CreditCard, Calendar, Users } from "lucide-react";
import { formatCents } from "@/lib/pricing";
import { isPayPalConfigured, isSquareConfigured } from "@/lib/payments/paypal";
import { cn } from "@/lib/utils";

interface PortalBooking {
  bookingReference: string;
  tripTitle: string;
  travelerCount: number;
  totalCents: number;
  amountPaidCents: number;
  balanceCents: number;
  currency: string;
  bookingStatus: string;
  paymentChoice: string;
  primaryTravelerName: string;
}

interface PaymentPortalProps {
  token: string;
  paypalEnabled: boolean;
  squareEnabled: boolean;
}

export function PaymentPortal({ token, paypalEnabled, squareEnabled }: PaymentPortalProps) {
  const [booking, setBooking] = useState<PortalBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const paypalReady = paypalEnabled && isPayPalConfigured();
  const squareReady = squareEnabled && isSquareConfigured();

  useEffect(() => {
    async function loadBooking() {
      try {
        const res = await fetch(`/api/bookings/portal/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Booking not found");
        setBooking(data.booking);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load booking");
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [token]);

  async function handlePayment(provider: "paypal" | "square") {
    if (!booking) return;
    setPaying(true);
    setError("");

    try {
      const res = await fetch(`/api/payments/${provider}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: booking.bookingReference,
          amountCents: booking.balanceCents,
          portalToken: token,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment failed");

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-rich-berry" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-2xl border border-rich-berry/30 bg-rich-berry/5 px-8 py-12 text-center">
        <p className="font-display text-xl text-deep-aubergine">
          {error || "Booking not found"}
        </p>
        <Link
          href="/manage-booking"
          className="mt-6 inline-block font-sans text-sm text-rich-berry hover:text-deep-aubergine"
        >
          Try another lookup
        </Link>
      </div>
    );
  }

  const statusLabel = booking.bookingStatus.replace(/_/g, " ");

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-muted-gold/20 bg-soft-ivory p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-luxury-ink/50">
              Booking Reference
            </p>
            <p className="font-display text-2xl text-deep-aubergine">{booking.bookingReference}</p>
          </div>
          <span className="rounded-full bg-warm-sand/60 px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-deep-aubergine">
            {statusLabel}
          </span>
        </div>

        <h2 className="mt-6 font-display text-xl text-deep-aubergine">{booking.tripTitle}</h2>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-gold" />
            <div>
              <dt className="font-sans text-xs text-luxury-ink/50">Travelers</dt>
              <dd className="font-sans text-sm font-medium">{booking.travelerCount}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-gold" />
            <div>
              <dt className="font-sans text-xs text-luxury-ink/50">Primary Traveler</dt>
              <dd className="font-sans text-sm font-medium">{booking.primaryTravelerName}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-gold" />
            <div>
              <dt className="font-sans text-xs text-luxury-ink/50">Payment Plan</dt>
              <dd className="font-sans text-sm font-medium capitalize">
                {booking.paymentChoice.replace(/_/g, " ")}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-8 space-y-3 border-t border-warm-sand pt-6 font-sans text-sm">
          <div className="flex justify-between">
            <span className="text-luxury-ink/60">Total</span>
            <span>{formatCents(booking.totalCents, booking.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury-ink/60">Paid</span>
            <span className="text-emerald">{formatCents(booking.amountPaidCents, booking.currency)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Balance Due</span>
            <span className="font-display text-lg text-rich-berry">
              {formatCents(booking.balanceCents, booking.currency)}
            </span>
          </div>
        </div>
      </div>

      {booking.balanceCents > 0 && (
        <div className="rounded-2xl border border-muted-gold/20 bg-warm-sand/20 p-6 sm:p-8">
          <h3 className="font-display text-xl text-deep-aubergine">Make a Payment</h3>
          <p className="mt-2 font-sans text-sm text-luxury-ink/70">
            Pay your remaining balance securely.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              disabled={paying || !paypalReady}
              onClick={() => handlePayment("paypal")}
              className={cn(
                "rounded-xl border p-5 font-display text-lg transition-colors",
                paypalReady
                  ? "border-muted-gold/30 hover:border-rich-berry"
                  : "border-dashed opacity-50"
              )}
            >
              PayPal
              {!paypalReady && (
                <span className="mt-1 block font-sans text-xs text-burnt-orange">Not configured</span>
              )}
            </button>
            <button
              type="button"
              disabled={paying || !squareReady}
              onClick={() => handlePayment("square")}
              className={cn(
                "rounded-xl border p-5 font-display text-lg transition-colors",
                squareReady
                  ? "border-muted-gold/30 hover:border-rich-berry"
                  : "border-dashed opacity-50"
              )}
            >
              Square
              {!squareReady && (
                <span className="mt-1 block font-sans text-xs text-burnt-orange">Not configured</span>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 font-sans text-sm text-rich-berry" role="alert">{error}</p>
          )}
        </div>
      )}

      {booking.balanceCents === 0 && (
        <div className="rounded-2xl border border-emerald/30 bg-emerald/10 px-6 py-8 text-center">
          <p className="font-display text-xl text-emerald">Your booking is fully paid!</p>
          <p className="mt-2 font-sans text-sm text-luxury-ink/70">
            We&apos;ll send trip details closer to departure. Questions?{" "}
            <Link href="/contact" className="text-rich-berry underline">Contact us</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
