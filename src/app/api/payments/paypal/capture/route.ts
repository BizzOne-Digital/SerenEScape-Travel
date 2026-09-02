import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking, Payment } from "@/lib/models";
import { capturePayPalOrder } from "@/lib/payments/paypal";
import { generateIdempotencyKey } from "@/lib/security/tokens";
import { jsonError, jsonOk } from "@/lib/api/helpers";

const schema = z.object({
  bookingId: z.string().min(1),
  portalToken: z.string().min(1),
  orderId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
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
    const booking = await Booking.findById(parsed.data.bookingId);

    if (!booking || booking.securePortalTokenHash !== hashToken(parsed.data.portalToken)) {
      return jsonError("Booking not found", 404);
    }

    const capture = await capturePayPalOrder(parsed.data.orderId);
    const captureUnit = capture.purchase_units?.[0]?.payments?.captures?.[0];

    if (!captureUnit || captureUnit.status !== "COMPLETED") {
      return jsonError("Payment capture failed");
    }

    const amountCents = Math.round(parseFloat(captureUnit.amount.value) * 100);
    const idempotencyKey = generateIdempotencyKey("paypal");

    await Payment.create({
      bookingId: booking._id,
      provider: "paypal",
      providerOrderId: parsed.data.orderId,
      providerPaymentId: captureUnit.id,
      idempotencyKey,
      type: booking.paymentChoice === "full" ? "full" : "deposit",
      amountCents,
      currency: captureUnit.amount.currency_code,
      status: "completed",
      paidAt: new Date(),
      safeProviderMetadata: { status: captureUnit.status },
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
      paymentId: captureUnit.id,
      amountCents,
      balanceCents: newBalance,
    });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return jsonError("Failed to capture payment", 500);
  }
}
