import { BRAND } from "@/config/brand";
import type { PaymentChoice, PricingBreakdown } from "@/types";

export function formatCents(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function getEffectivePriceCents(priceFromCents: number, salePriceCents?: number | null): number {
  if (salePriceCents != null && salePriceCents > 0 && salePriceCents < priceFromCents) {
    return salePriceCents;
  }
  return priceFromCents;
}

export interface PriceInput {
  priceFromCents: number;
  salePriceCents?: number | null;
  travelerCount: number;
  excursionTotalCents?: number;
  roomSupplementCents?: number;
  paymentChoice: PaymentChoice;
  promoDiscountCents?: number;
  payInFullDiscountPercent?: number;
  depositCents?: number;
  allowPromoStacking?: boolean;
}

export function calculatePricing(input: PriceInput): PricingBreakdown {
  const {
    priceFromCents,
    salePriceCents,
    travelerCount,
    excursionTotalCents = 0,
    roomSupplementCents = 0,
    paymentChoice,
    promoDiscountCents = 0,
    payInFullDiscountPercent = BRAND.payInFullDiscountPercent,
    depositCents = 0,
    allowPromoStacking = false,
  } = input;

  const unitPrice = getEffectivePriceCents(priceFromCents, salePriceCents);
  const baseSubtotal = unitPrice * travelerCount + excursionTotalCents + roomSupplementCents;
  const saleDiscountCents = salePriceCents != null && salePriceCents < priceFromCents
    ? (priceFromCents - salePriceCents) * travelerCount
    : 0;

  let payInFullDiscountCents = 0;
  if (paymentChoice === "full") {
    payInFullDiscountCents = Math.round(baseSubtotal * (payInFullDiscountPercent / 100));
  }

  const appliedPromo = allowPromoStacking || paymentChoice !== "full"
    ? promoDiscountCents
    : Math.min(promoDiscountCents, 0);

  const totalCents = Math.max(0, baseSubtotal - payInFullDiscountCents - appliedPromo);

  let amountDueNowCents = totalCents;
  if (paymentChoice === "deposit") {
    amountDueNowCents = depositCents * travelerCount;
  } else if (paymentChoice === "payment_plan") {
    amountDueNowCents = depositCents * travelerCount;
  }

  return {
    subtotalCents: baseSubtotal,
    saleDiscountCents,
    payInFullDiscountCents,
    promoDiscountCents: appliedPromo,
    totalCents,
    amountDueNowCents,
    currency: "USD",
  };
}

export function calculateBalance(totalCents: number, amountPaidCents: number): number {
  return Math.max(0, totalCents - amountPaidCents);
}

export interface InstallmentTemplate {
  sequence: number;
  label: string;
  amountCents: number;
  dueDate: Date;
}

export function generateInstallmentSchedule(params: {
  totalCents: number;
  depositCents: number;
  installmentCount: number;
  firstDueDate: Date;
  intervalDays?: number;
  finalDeadline?: Date;
}): InstallmentTemplate[] {
  const { totalCents, depositCents, installmentCount, firstDueDate, intervalDays = 30, finalDeadline } = params;
  const remaining = Math.max(0, totalCents - depositCents);
  const perInstallment = Math.floor(remaining / installmentCount);
  const remainder = remaining - perInstallment * installmentCount;
  const schedule: InstallmentTemplate[] = [];

  for (let i = 0; i < installmentCount; i++) {
    const dueDate = new Date(firstDueDate);
    dueDate.setDate(dueDate.getDate() + i * intervalDays);
    if (finalDeadline && dueDate > finalDeadline) {
      dueDate.setTime(finalDeadline.getTime());
    }
    const amount = perInstallment + (i === installmentCount - 1 ? remainder : 0);
    schedule.push({
      sequence: i + 1,
      label: `Installment ${i + 1} of ${installmentCount}`,
      amountCents: amount,
      dueDate,
    });
  }
  return schedule;
}

export function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "SE-";
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}
