import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { PromoCode, Trip } from "@/lib/models";
import { validatePromoCode } from "@/lib/pricing/promo";
import { promoCodeSchema } from "@/lib/validation/schemas";
import { jsonError, jsonOk } from "@/lib/api/helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = promoCodeSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid promo code");
    }

    if (!isDBConfigured()) {
      return jsonError("Service unavailable", 503);
    }

    await connectDB();
    const { code, tripSlug, email } = parsed.data;

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo) {
      return jsonOk({ valid: false, error: "Invalid promo code" });
    }

    let tripId: string | undefined;
    let subtotalCents = 0;

    if (tripSlug) {
      const trip = await Trip.findOne({ slug: tripSlug.toLowerCase() });
      if (trip) {
        tripId = trip._id.toString();
        subtotalCents = trip.priceFromCents;
      }
    }

    const result = validatePromoCode(promo, {
      subtotalCents: subtotalCents || 10000,
      tripId,
      email,
    });

    if (!result.valid) {
      return jsonOk({ valid: false, error: result.error });
    }

    return jsonOk({
      valid: true,
      discountCents: result.discountCents,
      code: promo.code,
      publicDescription: promo.publicDescription,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch {
    return jsonError("Failed to validate promo code", 500);
  }
}
