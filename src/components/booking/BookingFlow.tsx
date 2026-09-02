"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Users,
  Tag,
  FileText,
  Wallet,
} from "lucide-react";
import type { TripDetailData } from "@/lib/trips/queries";
import type { PaymentChoice } from "@/types";
import { calculatePricing, formatCents } from "@/lib/pricing";
import { BRAND } from "@/config/brand";
import { isPayPalConfigured, isSquareConfigured } from "@/lib/payments/paypal";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Selection", icon: Users },
  { id: 2, label: "Travelers", icon: Users },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Promo", icon: Tag },
  { id: 5, label: "Agreements", icon: FileText },
  { id: 6, label: "Pay", icon: Wallet },
] as const;

const inputClass =
  "w-full rounded-xl border border-muted-gold/30 bg-soft-ivory px-4 py-3 font-sans text-sm focus:border-rich-berry focus:outline-none focus:ring-2 focus:ring-rich-berry/20";

interface BookingFlowProps {
  trip: TripDetailData;
  paypalEnabled: boolean;
  squareEnabled: boolean;
}

interface TravelerForm {
  legalName: string;
  preferredName: string;
  email: string;
  phone: string;
  pronouns: string;
  dietaryRequirements: string;
  accessibilityRequirements: string;
}

interface BookingState {
  travelerCount: number;
  roomOptionId: string;
  excursionIds: string[];
  primaryTraveler: TravelerForm;
  additionalTravelers: Omit<TravelerForm, "email" | "phone">[];
  mailingAddress: { street: string; city: string; state: string; zip: string; country: string };
  emergencyContact: { name: string; relationship: string; phone: string };
  roomPreference: string;
  paymentChoice: PaymentChoice;
  promoCode: string;
  promoDiscountCents: number;
  termsAccepted: boolean;
  cancellationAccepted: boolean;
  newsletterConsent: boolean;
}

const defaultTraveler: TravelerForm = {
  legalName: "",
  preferredName: "",
  email: "",
  phone: "",
  pronouns: "",
  dietaryRequirements: "",
  accessibilityRequirements: "",
};

export function BookingFlow({ trip, paypalEnabled, squareEnabled }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const [state, setState] = useState<BookingState>({
    travelerCount: 1,
    roomOptionId: trip.roomOptions[0]?.id ?? "",
    excursionIds: [],
    primaryTraveler: { ...defaultTraveler },
    additionalTravelers: [],
    mailingAddress: { street: "", city: "", state: "", zip: "", country: "United States" },
    emergencyContact: { name: "", relationship: "", phone: "" },
    roomPreference: "",
    paymentChoice: trip.paymentPlanEnabled ? "deposit" : "full",
    promoCode: "",
    promoDiscountCents: 0,
    termsAccepted: false,
    cancellationAccepted: false,
    newsletterConsent: false,
  });

  const roomSupplement = trip.roomOptions.find((r) => r.id === state.roomOptionId)?.supplementCents ?? 0;
  const excursionTotal = trip.excursions
    .filter((e) => state.excursionIds.includes(e.id))
    .reduce((sum, e) => sum + e.priceCents, 0);

  const pricing = calculatePricing({
    priceFromCents: trip.priceFromCents,
    salePriceCents: trip.salePriceCents,
    travelerCount: state.travelerCount,
    excursionTotalCents: excursionTotal * state.travelerCount,
    roomSupplementCents: roomSupplement * state.travelerCount,
    paymentChoice: state.paymentChoice,
    promoDiscountCents: state.promoDiscountCents,
    payInFullDiscountPercent: trip.payInFullDiscountPercent,
    depositCents: trip.depositCents,
  });

  const paypalReady = paypalEnabled && isPayPalConfigured();
  const squareReady = squareEnabled && isSquareConfigured();

  function setTravelerCount(count: number) {
    setState((prev) => {
      const additional = Array.from({ length: Math.max(0, count - 1) }, (_, i) =>
        prev.additionalTravelers[i] ?? {
          legalName: "",
          preferredName: "",
          pronouns: "",
          dietaryRequirements: "",
          accessibilityRequirements: "",
        }
      );
      return { ...prev, travelerCount: count, additionalTravelers: additional };
    });
  }

  function updateState<K extends keyof BookingState>(key: K, value: BookingState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  async function validatePromo() {
    if (!state.promoCode.trim()) return;
    setError("");

    try {
      const res = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: state.promoCode,
          tripSlug: trip.slug,
          email: state.primaryTraveler.email,
          subtotalCents: pricing.subtotalCents,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        setError(data.error ?? "Invalid promo code");
        updateState("promoDiscountCents", 0);
        return;
      }

      updateState("promoDiscountCents", data.discountCents ?? 0);
    } catch {
      setError("Unable to validate promo code");
    }
  }

  async function createBooking() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripSlug: trip.slug,
          ...state,
          pricing,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create booking");

      setBookingRef(data.bookingReference);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePayment(provider: "paypal" | "square") {
    const booking = await createBooking();
    if (!booking) return;

    if (provider === "paypal" && !paypalReady) {
      setError("PayPal is not configured. Please contact us to complete payment.");
      return;
    }
    if (provider === "square" && !squareReady) {
      setError("Square is not configured. Please contact us to complete payment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/payments/${provider}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: booking.bookingReference,
          amountCents: pricing.amountDueNowCents,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment initiation failed");

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return state.travelerCount >= 1;
      case 2:
        return (
          state.primaryTraveler.legalName.length >= 2 &&
          state.primaryTraveler.email.includes("@") &&
          state.primaryTraveler.phone.length >= 10 &&
          state.mailingAddress.street.length > 0 &&
          state.emergencyContact.name.length >= 2
        );
      case 3:
        return Boolean(state.paymentChoice);
      case 4:
        return true;
      case 5:
        return state.termsAccepted && state.cancellationAccepted;
      case 6:
        return true;
      default:
        return false;
    }
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl overflow-x-clip">
      <nav aria-label="Booking progress" className="mb-10 min-w-0">
        <ol className="flex min-w-0 items-center justify-between gap-0.5 sm:gap-1">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isComplete = step > s.id;
            return (
              <li key={s.id} className="flex flex-1 flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors sm:h-10 sm:w-10",
                    isComplete && "border-emerald bg-emerald text-soft-ivory",
                    isActive && !isComplete && "border-rich-berry bg-rich-berry text-soft-ivory",
                    !isActive && !isComplete && "border-muted-gold/40 text-luxury-ink/40"
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    "mt-1.5 hidden font-sans text-[10px] sm:block",
                    isActive ? "font-medium text-rich-berry" : "text-luxury-ink/50"
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="min-w-0 overflow-hidden rounded-2xl border border-muted-gold/20 bg-soft-ivory p-4 sm:p-6 md:p-8">
        {step === 1 && (
          <StepSelection trip={trip} state={state} updateState={updateState} setTravelerCount={setTravelerCount} inputClass={inputClass} />
        )}
        {step === 2 && (
          <StepTravelers state={state} updateState={updateState} inputClass={inputClass} />
        )}
        {step === 3 && (
          <StepPaymentOption trip={trip} state={state} updateState={updateState} pricing={pricing} />
        )}
        {step === 4 && (
          <StepPromo
            state={state}
            updateState={updateState}
            onValidate={validatePromo}
            inputClass={inputClass}
            pricing={pricing}
          />
        )}
        {step === 5 && (
          <StepAgreements state={state} updateState={updateState} />
        )}
        {step === 6 && (
          <StepPayment
            pricing={pricing}
            currency={trip.currency}
            paypalReady={paypalReady}
            squareReady={squareReady}
            onPay={handlePayment}
            submitting={submitting}
            bookingRef={bookingRef}
          />
        )}

        {error && (
          <p className="mt-4 font-sans text-sm text-rich-berry" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-warm-sand pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1 font-sans text-sm text-deep-aubergine hover:text-rich-berry"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <Link href={`/trips/${trip.slug}`} className="font-sans text-sm text-deep-aubergine hover:text-rich-berry">
              ← Back to trip
            </Link>
          )}

          {step < 6 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1 rounded-full bg-rich-berry px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-deep-aubergine disabled:opacity-50"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <aside className="mt-6 rounded-2xl border border-muted-gold/20 bg-warm-sand/20 p-6">
        <h3 className="font-display text-lg text-deep-aubergine">Booking Summary</h3>
        <p className="mt-1 font-sans text-sm text-luxury-ink/60">{trip.title}</p>
        <dl className="mt-4 space-y-2 font-sans text-sm">
          <div className="flex justify-between">
            <dt className="text-luxury-ink/60">Travelers</dt>
            <dd>{state.travelerCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-luxury-ink/60">Subtotal</dt>
            <dd>{formatCents(pricing.subtotalCents, trip.currency)}</dd>
          </div>
          {pricing.payInFullDiscountCents > 0 && (
            <div className="flex justify-between text-emerald">
              <dt>Pay in full discount</dt>
              <dd>-{formatCents(pricing.payInFullDiscountCents, trip.currency)}</dd>
            </div>
          )}
          {pricing.promoDiscountCents > 0 && (
            <div className="flex justify-between text-emerald">
              <dt>Promo discount</dt>
              <dd>-{formatCents(pricing.promoDiscountCents, trip.currency)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-warm-sand pt-2 font-medium">
            <dt>Total</dt>
            <dd className="font-display text-lg text-deep-aubergine">
              {formatCents(pricing.totalCents, trip.currency)}
            </dd>
          </div>
          <div className="flex justify-between text-rich-berry">
            <dt>Due now</dt>
            <dd className="font-medium">{formatCents(pricing.amountDueNowCents, trip.currency)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function StepSelection({
  trip,
  state,
  updateState,
  setTravelerCount,
  inputClass,
}: {
  trip: TripDetailData;
  state: BookingState;
  updateState: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void;
  setTravelerCount: (count: number) => void;
  inputClass: string;
}) {
  const spotsLeft = Math.max(0, trip.capacity - trip.reservedCount);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-deep-aubergine">Select Your Options</h2>

      <div>
        <label htmlFor="traveler-count" className="mb-1.5 block font-sans text-sm font-medium">
          Number of Travelers
        </label>
        <select
          id="traveler-count"
          value={state.travelerCount}
          onChange={(e) => setTravelerCount(Number(e.target.value))}
          className={inputClass}
        >
          {Array.from({ length: Math.min(spotsLeft, trip.groupMax) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "traveler" : "travelers"}</option>
          ))}
        </select>
        <p className="mt-1 font-sans text-xs text-luxury-ink/50">{spotsLeft} spots remaining</p>
      </div>

      {trip.roomOptions.length > 0 && (
        <div>
          <label htmlFor="room-option" className="mb-1.5 block font-sans text-sm font-medium">
            Room Option
          </label>
          <select
            id="room-option"
            value={state.roomOptionId}
            onChange={(e) => updateState("roomOptionId", e.target.value)}
            className={inputClass}
          >
            {trip.roomOptions.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
                {room.supplementCents > 0 && ` (+${formatCents(room.supplementCents)})`}
              </option>
            ))}
          </select>
        </div>
      )}

      {trip.excursions.length > 0 && (
        <fieldset>
          <legend className="mb-3 font-sans text-sm font-medium">Optional Excursions</legend>
          <div className="space-y-2">
            {trip.excursions.map((exc) => (
              <label key={exc.id} className="flex items-center gap-3 rounded-xl border border-muted-gold/20 p-4">
                <input
                  type="checkbox"
                  checked={state.excursionIds.includes(exc.id)}
                  onChange={(e) => {
                    const ids = e.target.checked
                      ? [...state.excursionIds, exc.id]
                      : state.excursionIds.filter((id) => id !== exc.id);
                    updateState("excursionIds", ids);
                  }}
                  className="h-4 w-4 rounded border-muted-gold text-rich-berry"
                />
                <span className="flex-1 font-sans text-sm">{exc.name}</span>
                <span className="font-sans text-sm text-rich-berry">
                  +{formatCents(exc.priceCents)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

function StepTravelers({
  state,
  updateState,
  inputClass,
}: {
  state: BookingState;
  updateState: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void;
  inputClass: string;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-deep-aubergine">Traveler Information</h2>

      <fieldset className="space-y-4">
        <legend className="font-sans text-sm font-medium text-rich-berry">Primary Traveler</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <input placeholder="Legal name *" className={inputClass} value={state.primaryTraveler.legalName}
            onChange={(e) => updateState("primaryTraveler", { ...state.primaryTraveler, legalName: e.target.value })} />
          <input placeholder="Preferred name" className={inputClass} value={state.primaryTraveler.preferredName}
            onChange={(e) => updateState("primaryTraveler", { ...state.primaryTraveler, preferredName: e.target.value })} />
          <input type="email" placeholder="Email *" className={inputClass} value={state.primaryTraveler.email}
            onChange={(e) => updateState("primaryTraveler", { ...state.primaryTraveler, email: e.target.value })} />
          <input type="tel" placeholder="Phone *" className={inputClass} value={state.primaryTraveler.phone}
            onChange={(e) => updateState("primaryTraveler", { ...state.primaryTraveler, phone: e.target.value })} />
        </div>
      </fieldset>

      {state.additionalTravelers.map((traveler, i) => (
        <fieldset key={i} className="space-y-4">
          <legend className="font-sans text-sm font-medium text-rich-berry">
            Traveler {i + 2}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Legal name *" className={inputClass} value={traveler.legalName}
              onChange={(e) => {
                const updated = [...state.additionalTravelers];
                updated[i] = { ...traveler, legalName: e.target.value };
                updateState("additionalTravelers", updated);
              }} />
            <input placeholder="Preferred name" className={inputClass} value={traveler.preferredName}
              onChange={(e) => {
                const updated = [...state.additionalTravelers];
                updated[i] = { ...traveler, preferredName: e.target.value };
                updateState("additionalTravelers", updated);
              }} />
          </div>
        </fieldset>
      ))}

      <fieldset className="space-y-4">
        <legend className="font-sans text-sm font-medium text-rich-berry">Mailing Address</legend>
        <input placeholder="Street address *" className={inputClass} value={state.mailingAddress.street}
          onChange={(e) => updateState("mailingAddress", { ...state.mailingAddress, street: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <input placeholder="City *" className={inputClass} value={state.mailingAddress.city}
            onChange={(e) => updateState("mailingAddress", { ...state.mailingAddress, city: e.target.value })} />
          <input placeholder="State *" className={inputClass} value={state.mailingAddress.state}
            onChange={(e) => updateState("mailingAddress", { ...state.mailingAddress, state: e.target.value })} />
          <input placeholder="ZIP *" className={inputClass} value={state.mailingAddress.zip}
            onChange={(e) => updateState("mailingAddress", { ...state.mailingAddress, zip: e.target.value })} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-sans text-sm font-medium text-rich-berry">Emergency Contact</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <input placeholder="Name *" className={inputClass} value={state.emergencyContact.name}
            onChange={(e) => updateState("emergencyContact", { ...state.emergencyContact, name: e.target.value })} />
          <input placeholder="Relationship *" className={inputClass} value={state.emergencyContact.relationship}
            onChange={(e) => updateState("emergencyContact", { ...state.emergencyContact, relationship: e.target.value })} />
          <input type="tel" placeholder="Phone *" className={inputClass} value={state.emergencyContact.phone}
            onChange={(e) => updateState("emergencyContact", { ...state.emergencyContact, phone: e.target.value })} />
        </div>
      </fieldset>
    </div>
  );
}

function StepPaymentOption({
  trip,
  state,
  updateState,
  pricing,
}: {
  trip: TripDetailData;
  state: BookingState;
  updateState: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void;
  pricing: ReturnType<typeof calculatePricing>;
}) {
  const options: { value: PaymentChoice; label: string; description: string }[] = [
    {
      value: "deposit",
      label: "Pay Deposit",
      description: `Reserve your spot with ${formatCents(trip.depositCents * state.travelerCount, trip.currency)} now`,
    },
    {
      value: "full",
      label: "Pay in Full",
      description: `Save ${trip.payInFullDiscountPercent}% — ${formatCents(pricing.totalCents, trip.currency)} total`,
    },
  ];

  if (trip.paymentPlanEnabled) {
    options.push({
      value: "payment_plan",
      label: "Payment Plan",
      description: `Deposit now, then installments until departure`,
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-deep-aubergine">Choose Payment Option</h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex cursor-pointer items-start gap-4 rounded-xl border p-5 transition-colors",
              state.paymentChoice === opt.value
                ? "border-rich-berry bg-rich-berry/5"
                : "border-muted-gold/20 hover:bg-warm-sand/30"
            )}
          >
            <input
              type="radio"
              name="paymentChoice"
              value={opt.value}
              checked={state.paymentChoice === opt.value}
              onChange={() => updateState("paymentChoice", opt.value)}
              className="mt-1 h-4 w-4 text-rich-berry"
            />
            <div>
              <p className="font-sans text-sm font-medium text-deep-aubergine">{opt.label}</p>
              <p className="mt-1 font-sans text-sm text-luxury-ink/60">{opt.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepPromo({
  state,
  updateState,
  onValidate,
  inputClass,
  pricing,
}: {
  state: BookingState;
  updateState: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void;
  onValidate: () => void;
  inputClass: string;
  pricing: ReturnType<typeof calculatePricing>;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-deep-aubergine">Promo Code</h2>
      <p className="font-sans text-sm text-luxury-ink/60">
        Have a promo code? Enter it below. This step is optional.
      </p>
      <div className="flex gap-3">
        <input
          placeholder="Enter promo code"
          className={inputClass}
          value={state.promoCode}
          onChange={(e) => updateState("promoCode", e.target.value.toUpperCase())}
        />
        <button
          type="button"
          onClick={onValidate}
          className="shrink-0 rounded-full bg-deep-aubergine px-6 py-3 font-sans text-sm font-medium text-soft-ivory hover:bg-rich-berry"
        >
          Apply
        </button>
      </div>
      {state.promoDiscountCents > 0 && (
        <p className="font-sans text-sm text-emerald">
          Promo applied! You save {formatCents(state.promoDiscountCents)}.
        </p>
      )}
      <p className="font-sans text-xs text-luxury-ink/50">
        Updated total: {formatCents(pricing.totalCents)}
      </p>
    </div>
  );
}

function StepAgreements({
  state,
  updateState,
}: {
  state: BookingState;
  updateState: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-deep-aubergine">Terms & Agreements</h2>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={state.termsAccepted}
          onChange={(e) => updateState("termsAccepted", e.target.checked)}
          className="mt-1 h-4 w-4 rounded text-rich-berry"
        />
        <span className="font-sans text-sm text-luxury-ink/80">
          I agree to the{" "}
          <Link href="/terms" className="text-rich-berry underline" target="_blank">
            Terms of Service
          </Link>{" "}
          and booking conditions. *
        </span>
      </label>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={state.cancellationAccepted}
          onChange={(e) => updateState("cancellationAccepted", e.target.checked)}
          className="mt-1 h-4 w-4 rounded text-rich-berry"
        />
        <span className="font-sans text-sm text-luxury-ink/80">
          I have read and accept the{" "}
          <Link href="/cancellation-policy" className="text-rich-berry underline" target="_blank">
            Cancellation Policy
          </Link>
          . *
        </span>
      </label>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={state.newsletterConsent}
          onChange={(e) => updateState("newsletterConsent", e.target.checked)}
          className="mt-1 h-4 w-4 rounded text-rich-berry"
        />
        <span className="font-sans text-sm text-luxury-ink/80">
          Keep me updated on new journeys and community events from {BRAND.name}.
        </span>
      </label>
    </div>
  );
}

function StepPayment({
  pricing,
  currency,
  paypalReady,
  squareReady,
  onPay,
  submitting,
  bookingRef,
}: {
  pricing: ReturnType<typeof calculatePricing>;
  currency: string;
  paypalReady: boolean;
  squareReady: boolean;
  onPay: (provider: "paypal" | "square") => void;
  submitting: boolean;
  bookingRef: string | null;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-deep-aubergine">Complete Payment</h2>
      <p className="font-sans text-sm text-luxury-ink/70">
        Amount due now:{" "}
        <strong className="text-deep-aubergine">
          {formatCents(pricing.amountDueNowCents, currency)}
        </strong>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => onPay("paypal")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-6 transition-colors",
            paypalReady
              ? "border-muted-gold/30 hover:border-rich-berry hover:bg-warm-sand/30"
              : "border-dashed border-muted-gold/40 opacity-60"
          )}
        >
          {submitting ? (
            <Loader2 className="h-6 w-6 animate-spin text-rich-berry" />
          ) : (
            <span className="font-display text-lg text-deep-aubergine">PayPal</span>
          )}
          {!paypalReady && (
            <span className="font-sans text-xs text-burnt-orange">Not configured</span>
          )}
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() => onPay("square")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-6 transition-colors",
            squareReady
              ? "border-muted-gold/30 hover:border-rich-berry hover:bg-warm-sand/30"
              : "border-dashed border-muted-gold/40 opacity-60"
          )}
        >
          {submitting ? (
            <Loader2 className="h-6 w-6 animate-spin text-rich-berry" />
          ) : (
            <span className="font-display text-lg text-deep-aubergine">Square</span>
          )}
          {!squareReady && (
            <span className="font-sans text-xs text-burnt-orange">Not configured</span>
          )}
        </button>
      </div>

      {!paypalReady && !squareReady && (
        <div className="rounded-xl border border-burnt-orange/30 bg-burnt-orange/10 px-5 py-4 font-sans text-sm text-burnt-orange">
          Online payment is not yet configured. Your booking will be saved and our team will contact
          you to arrange payment.
        </div>
      )}

      {bookingRef && (
        <p className="font-sans text-sm text-emerald">
          Booking reference: <strong>{bookingRef}</strong>
        </p>
      )}
    </div>
  );
}
