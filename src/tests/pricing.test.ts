import { describe, it, expect } from "vitest";
import {
  calculatePricing,
  calculateBalance,
  generateInstallmentSchedule,
  generateBookingReference,
  getEffectivePriceCents,
  formatCents,
} from "@/lib/pricing";
import { validatePromoCode } from "@/lib/pricing/promo";
import type { IPromoCode } from "@/lib/models/PromoCode";

describe("pricing", () => {
  it("calculates effective sale price", () => {
    expect(getEffectivePriceCents(100000, 80000)).toBe(80000);
    expect(getEffectivePriceCents(100000, null)).toBe(100000);
  });

  it("applies 5% pay-in-full discount", () => {
    const result = calculatePricing({
      priceFromCents: 213600,
      travelerCount: 1,
      paymentChoice: "full",
      payInFullDiscountPercent: 5,
    });
    expect(result.payInFullDiscountCents).toBe(10680);
    expect(result.totalCents).toBe(202920);
  });

  it("prevents double discounting with promo on full payment by default", () => {
    const result = calculatePricing({
      priceFromCents: 100000,
      travelerCount: 1,
      paymentChoice: "full",
      promoDiscountCents: 5000,
      allowPromoStacking: false,
    });
    expect(result.promoDiscountCents).toBe(0);
    expect(result.payInFullDiscountCents).toBe(5000);
  });

  it("calculates deposit amount due", () => {
    const result = calculatePricing({
      priceFromCents: 213600,
      travelerCount: 2,
      paymentChoice: "deposit",
      depositCents: 50000,
    });
    expect(result.amountDueNowCents).toBe(100000);
  });

  it("calculates remaining balance", () => {
    expect(calculateBalance(200000, 50000)).toBe(150000);
    expect(calculateBalance(200000, 250000)).toBe(0);
  });

  it("generates installment schedule", () => {
    const schedule = generateInstallmentSchedule({
      totalCents: 100000,
      depositCents: 25000,
      installmentCount: 3,
      firstDueDate: new Date("2027-01-01"),
      intervalDays: 30,
    });
    expect(schedule).toHaveLength(3);
    const total = schedule.reduce((sum, i) => sum + i.amountCents, 0);
    expect(total).toBe(75000);
  });

  it("generates unique booking references", () => {
    const ref1 = generateBookingReference();
    const ref2 = generateBookingReference();
    expect(ref1).toMatch(/^SE-[A-Z0-9]{8}$/);
    expect(ref1).not.toBe(ref2);
  });

  it("formats cents to currency", () => {
    expect(formatCents(213600)).toBe("$2,136.00");
  });
});

describe("promo validation", () => {
  const basePromo = {
    code: "TEST10",
    active: true,
    discountType: "percentage" as const,
    discountValue: 10,
    redemptionCount: 0,
    perEmailLimit: 1,
    publicDisplay: true,
    homepageBanner: false,
    stackable: false,
    internalName: "Test",
  };

  it("validates active promo", () => {
    const result = validatePromoCode(basePromo as unknown as IPromoCode, {
      subtotalCents: 100000,
    });
    expect(result.valid).toBe(true);
    expect(result.discountCents).toBe(10000);
  });

  it("rejects expired promo", () => {
    const result = validatePromoCode(
      { ...basePromo, endDate: new Date("2020-01-01") } as unknown as IPromoCode,
      { subtotalCents: 100000, now: new Date("2027-01-01") }
    );
    expect(result.valid).toBe(false);
  });

  it("rejects inactive promo", () => {
    const result = validatePromoCode(
      { ...basePromo, active: false } as unknown as IPromoCode,
      { subtotalCents: 100000 }
    );
    expect(result.valid).toBe(false);
  });
});
