import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip, PromoCode } from "@/lib/models";
import { calculatePricing } from "@/lib/pricing";
import { validatePromoCode } from "@/lib/pricing/promo";
import { jsonError, jsonOk } from "@/lib/api/helpers";

const calculateSchema = z.object({
  tripSlug: z.string().min(1),
  travelerCount: z.number().int().min(1).max(20),
  roomOptionId: z.string().optional(),
  excursionIds: z.array(z.string()).optional(),
  paymentChoice: z.enum(["deposit", "full", "payment_plan"]),
  promoCode: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = calculateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request");
    }

    const data = parsed.data;

    if (!isDBConfigured()) {
      return jsonError("Service unavailable", 503);
    }

    await connectDB();
    const trip = await Trip.findOne({ slug: data.tripSlug.toLowerCase() });
    if (!trip) {
      return jsonError("Trip not found", 404);
    }

    const roomOption = data.roomOptionId
      ? trip.roomOptions.find((r) => r.id === data.roomOptionId)
      : undefined;

    const selectedExcursions = (data.excursionIds ?? [])
      .map((id) => trip.excursions.find((e) => e.id === id))
      .filter(Boolean) as { id: string; name: string; priceCents: number }[];

    const excursionTotalCents = selectedExcursions.reduce((sum, e) => sum + e.priceCents, 0);
    const roomSupplementCents = (roomOption?.supplementCents ?? 0) * data.travelerCount;

    let promoDiscountCents = 0;
    let promoValid = false;
    let promoMessage: string | undefined;

    if (data.promoCode) {
      const promo = await PromoCode.findOne({ code: data.promoCode.toUpperCase() });
      const baseSubtotal =
        (trip.salePriceCents && trip.salePriceCents < trip.priceFromCents
          ? trip.salePriceCents
          : trip.priceFromCents) *
          data.travelerCount +
        excursionTotalCents +
        roomSupplementCents;

      const validation = validatePromoCode(promo, {
        subtotalCents: baseSubtotal,
        tripId: trip._id.toString(),
        email: data.email,
      });

      if (validation.valid) {
        promoDiscountCents = validation.discountCents ?? 0;
        promoValid = true;
      } else {
        promoMessage = validation.error;
      }
    }

    const pricing = calculatePricing({
      priceFromCents: trip.priceFromCents,
      salePriceCents: trip.salePriceCents,
      travelerCount: data.travelerCount,
      excursionTotalCents,
      roomSupplementCents,
      paymentChoice: data.paymentChoice,
      promoDiscountCents,
      payInFullDiscountPercent: trip.payInFullDiscountPercent,
      depositCents: trip.depositCents,
      allowPromoStacking: false,
    });

    return jsonOk({
      pricing,
      promo: { valid: promoValid, message: promoMessage, discountCents: promoDiscountCents },
      roomOption,
      selectedExcursions,
    });
  } catch {
    return jsonError("Failed to calculate pricing", 500);
  }
}
