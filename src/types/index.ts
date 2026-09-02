export type TripStatus =
  | "draft"
  | "coming_soon"
  | "booking_open"
  | "limited_spots"
  | "sold_out"
  | "waitlist"
  | "completed";

export type BookingStatus =
  | "pending_payment"
  | "deposit_paid"
  | "payment_plan_active"
  | "paid_in_full"
  | "payment_overdue"
  | "confirmed"
  | "waitlisted"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "cancelled";

export type PaymentProvider = "paypal" | "square" | "manual";

export type PaymentType = "deposit" | "installment" | "full" | "balance";

export type PaymentChoice = "deposit" | "full" | "payment_plan";

export type InstallmentStatus = "pending" | "paid" | "overdue" | "waived" | "cancelled";

export interface PricingBreakdown {
  subtotalCents: number;
  saleDiscountCents: number;
  payInFullDiscountCents: number;
  promoDiscountCents: number;
  totalCents: number;
  amountDueNowCents: number;
  currency: string;
}
