import type { IPromoCode } from "@/lib/models/PromoCode";

export interface PromoValidationResult {
  valid: boolean;
  error?: string;
  discountCents?: number;
  promo?: IPromoCode;
}

export function validatePromoCode(
  promo: IPromoCode | null,
  params: {
    subtotalCents: number;
    tripId?: string;
    email?: string;
    now?: Date;
  }
): PromoValidationResult {
  if (!promo) return { valid: false, error: "Invalid promo code" };
  if (!promo.active) return { valid: false, error: "This promo code is no longer active" };

  const now = params.now ?? new Date();
  if (promo.startDate && now < promo.startDate) {
    return { valid: false, error: "This promo code is not yet active" };
  }
  if (promo.endDate && now > promo.endDate) {
    return { valid: false, error: "This promo code has expired" };
  }
  if (promo.maxRedemptions && promo.redemptionCount >= promo.maxRedemptions) {
    return { valid: false, error: "This promo code has reached its usage limit" };
  }
  if (promo.minimumSpendCents && params.subtotalCents < promo.minimumSpendCents) {
    return { valid: false, error: `Minimum spend of $${(promo.minimumSpendCents / 100).toFixed(2)} required` };
  }
  if (promo.applicableTripIds?.length && params.tripId) {
    const applicable = promo.applicableTripIds.some((id) => id.toString() === params.tripId);
    if (!applicable) return { valid: false, error: "This promo code is not valid for this trip" };
  }

  let discountCents = 0;
  if (promo.discountType === "percentage") {
    discountCents = Math.round(params.subtotalCents * (promo.discountValue / 100));
  } else {
    discountCents = promo.discountValue;
  }
  discountCents = Math.min(discountCents, params.subtotalCents);

  return { valid: true, discountCents, promo };
}

export function calculatePromoDiscount(promo: IPromoCode, subtotalCents: number): number {
  if (promo.discountType === "percentage") {
    return Math.round(subtotalCents * (promo.discountValue / 100));
  }
  return Math.min(promo.discountValue, subtotalCents);
}
