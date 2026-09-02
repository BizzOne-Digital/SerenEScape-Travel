import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking } from "@/lib/models";
import { isSquareReady } from "@/lib/payments/square";

export async function POST(request: Request) {
  try {
    const { bookingReference, amountCents } = await request.json();

    if (!bookingReference || !amountCents) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    if (!isSquareReady()) {
      return NextResponse.json(
        { error: "Square is not configured. Please contact us to complete payment." },
        { status: 503 }
      );
    }

    if (!isDBConfigured()) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    await connectDB();
    const booking = await Booking.findOne({ bookingReference });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    return NextResponse.json({
      redirectUrl: `${baseUrl}/booking/success?reference=${bookingReference}&provider=square&verified=true`,
      message: "Square Web Payments SDK integration placeholder — configure client-side tokenization for production.",
    });
  } catch {
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
