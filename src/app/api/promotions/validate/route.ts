import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { PromoCode, Trip } from "@/lib/models";
import { validatePromoCode } from "@/lib/pricing/promo";

export async function POST(request: Request) {
  try {
    const { code, tripSlug, email, subtotalCents } = await request.json();

    if (!code || !subtotalCents) {
      return NextResponse.json({ error: "Code and subtotal required" }, { status: 400 });
    }

    if (!isDBConfigured()) {
      return NextResponse.json({ valid: false, error: "Service unavailable" });
    }

    await connectDB();

    const promo = await PromoCode.findOne({ code: code.toUpperCase().trim() });
    let tripId: string | undefined;

    if (tripSlug) {
      const trip = await Trip.findOne({ slug: tripSlug }).select("_id");
      tripId = trip?._id?.toString();
    }

    const result = validatePromoCode(promo, {
      subtotalCents,
      tripId,
      email,
    });

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error });
    }

    return NextResponse.json({
      valid: true,
      discountCents: result.discountCents,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Validation failed" });
  }
}
