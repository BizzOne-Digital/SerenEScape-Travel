import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking, Trip } from "@/lib/models";
import { hashToken } from "@/lib/security/tokens";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (!isDBConfigured()) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    await connectDB();

    const tokenHash = hashToken(token);
    const booking = await Booking.findOne({ securePortalTokenHash: tokenHash }).lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or link expired" }, { status: 404 });
    }

    const trip = await Trip.findById(booking.tripId).select("title").lean();

    return NextResponse.json({
      booking: {
        bookingReference: booking.bookingReference,
        tripTitle: trip?.title ?? "Your Journey",
        travelerCount: booking.travelerCount,
        totalCents: booking.totalCents,
        amountPaidCents: booking.amountPaidCents,
        balanceCents: booking.balanceCents,
        currency: booking.currency,
        bookingStatus: booking.bookingStatus,
        paymentChoice: booking.paymentChoice,
        primaryTravelerName: booking.primaryTraveler.legalName,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load booking" }, { status: 500 });
  }
}
