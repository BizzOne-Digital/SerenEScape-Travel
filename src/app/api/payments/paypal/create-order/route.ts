import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking } from "@/lib/models";
import { createPayPalOrder } from "@/lib/payments/paypal";
import { calculatePricing } from "@/lib/pricing";
import { jsonError, jsonOk } from "@/lib/api/helpers";

const schema = z.object({
  bookingId: z.string().min(1),
  portalToken: z.string().min(1),
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

    const order = await createPayPalOrder(
      pricing.amountDueNowCents,
      booking.currency,
      booking.bookingReference
    );

    return jsonOk({ orderId: order.id, amountCents: pricing.amountDueNowCents });
  } catch (err) {
    console.error("PayPal create order error:", err);
    return jsonError("Failed to create PayPal order", 500);
  }
}
