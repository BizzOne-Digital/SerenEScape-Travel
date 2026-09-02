import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { PromoCode } from "@/lib/models/PromoCode";

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json({ promotions: [] });
  }

  try {
    await connectDB();
    const now = new Date();

    const promotions = await PromoCode.find({
      active: true,
      homepageBanner: true,
      $and: [
        { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
      ],
    })
      .select("code publicDescription discountType discountValue startDate endDate homepageBanner")
      .sort({ startDate: -1 })
      .lean();

    return NextResponse.json({ promotions });
  } catch {
    return NextResponse.json({ promotions: [] });
  }
}
