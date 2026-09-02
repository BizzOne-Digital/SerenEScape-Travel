import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking } from "@/lib/models";
import { generateSecureToken, hashToken } from "@/lib/security/tokens";

export async function POST(request: Request) {
  try {
    const { reference, email } = await request.json();

    if (!reference || !email) {
      return NextResponse.json({ error: "Reference and email are required" }, { status: 400 });
    }

    if (!isDBConfigured()) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    await connectDB();

    const booking = await Booking.findOne({
      bookingReference: reference.trim().toUpperCase(),
      "primaryTraveler.email": email.trim().toLowerCase(),
    });

    if (!booking) {
      return NextResponse.json({ error: "No booking found with those details" }, { status: 404 });
    }

    const portalToken = generateSecureToken();
    booking.securePortalTokenHash = hashToken(portalToken);
    await booking.save();

    return NextResponse.json({ portalToken });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
