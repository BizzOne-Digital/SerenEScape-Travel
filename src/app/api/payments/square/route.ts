import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking, Payment } from "@/lib/models";
import { createSquarePayment, isSquareReady } from "@/lib/payments/square";
import { calculatePricing } from "@/lib/pricing";
import { generateIdempotencyKey } from "@/lib/security/tokens";
import { jsonError, jsonOk } from "@/lib/api/helpers";

const schema = z.object({
  bookingId: z.string().min(1),
  portalToken: z.string().min(1),
  sourceId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    if (!isSquareReady()) {
      return jsonError("Square payments are not configured", 503);
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid request");
    }

    if (!isDBConfigured()) {
      return jsonError("Service unavailable", 503);
    }

    await connectDB();
    const { hashToken } = await import("@/lib/security/tokens");
    const booking = await Booking.findById(parsed.data.bookingId).populate("tripId");

    if (!booking || booking.securePortalTokenHash !== hashToken(parsed.data.portalToken)) {
      return jsonError("Booking not found", 404);
    }

    const trip = booking.tripId as unknown as {
      depositCents: number;
      payInFullDiscountPercent: number;
      priceFromCents: number;
      salePriceCents?: number;
    };

    const pricing = calculatePricing({
      priceFromCents: trip.priceFromCents,
      salePriceCents: trip.salePriceCents,
      travelerCount: booking.travelerCount,
      excursionTotalCents: booking.selectedExcursions.reduce((s, e) => s + e.priceCents, 0),
      roomSupplementCents: (booking.roomOption?.supplementCents ?? 0) * booking.travelerCount,
      paymentChoice: booking.paymentChoice,
      promoDiscountCents: booking.promoDiscountCents,
      payInFullDiscountPercent: trip.payInFullDiscountPercent,
      depositCents: trip.depositCents,
    });

    const idempotencyKey = generateIdempotencyKey("square");
    const result = await createSquarePayment({
      sourceId: parsed.data.sourceId,
      amountCents: pricing.amountDueNowCents,
      currency: booking.currency,
      idempotencyKey,
      reference: booking.bookingReference,
    });

    const payment = result.payment;
    if (!payment || payment.status !== "COMPLETED") {
      return jsonError("Payment failed");
    }

    const amountCents = Number(payment.amountMoney?.amount ?? pricing.amountDueNowCents);

    await Payment.create({
      bookingId: booking._id,
      provider: "square",
      providerPaymentId: payment.id,
      idempotencyKey,
      type: booking.paymentChoice === "full" ? "full" : "deposit",
      amountCents,
      currency: payment.amountMoney?.currency ?? booking.currency,
      status: "completed",
      paidAt: new Date(),
      safeProviderMetadata: { status: payment.status ?? "unknown" },
    });

    const newAmountPaid = booking.amountPaidCents + amountCents;
    const newBalance = Math.max(0, booking.totalCents - newAmountPaid);
    const bookingStatus =
      newBalance === 0
        ? "paid_in_full"
        : booking.paymentChoice === "payment_plan"
          ? "payment_plan_active"
          : "deposit_paid";

    await Booking.updateOne(
      { _id: booking._id },
      {
        amountPaidCents: newAmountPaid,
        balanceCents: newBalance,
        bookingStatus,
        paymentStatus: newBalance === 0 ? "paid" : "partial",
      }
    );

    return jsonOk({
      success: true,
      paymentId: payment.id,
      amountCents,
      balanceCents: newBalance,
    });
  } catch (err) {
    console.error("Square payment error:", err);
    return jsonError("Failed to process payment", 500);
  }
}
