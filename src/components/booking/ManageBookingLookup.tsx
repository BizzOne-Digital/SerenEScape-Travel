"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-muted-gold/30 bg-soft-ivory px-4 py-3 font-sans text-sm text-luxury-ink focus:border-rich-berry focus:outline-none focus:ring-2 focus:ring-rich-berry/20";

export function ManageBookingLookup() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.trim(), email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Booking not found");
      }

      if (data.portalToken) {
        router.push(`/manage-booking/${data.portalToken}`);
      } else {
        throw new Error("Unable to access booking portal");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
      <div>
        <label htmlFor="booking-ref" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
          Booking Reference
        </label>
        <input
          id="booking-ref"
          type="text"
          required
          placeholder="SE-XXXXXXXX"
          value={reference}
          onChange={(e) => setReference(e.target.value.toUpperCase())}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="booking-email" className="mb-1.5 block font-sans text-sm font-medium text-deep-aubergine">
          Email Address
        </label>
        <input
          id="booking-email"
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <p className="mt-1.5 font-sans text-xs text-luxury-ink/50">
          Use the email address associated with your booking.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-deep-aubergine disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        Find My Booking
      </button>

      {error && (
        <p className="font-sans text-sm text-rich-berry" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
