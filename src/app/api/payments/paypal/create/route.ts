import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking } from "@/lib/models";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/payments/paypal";

export async function POST(request: Request) {
  try {
    const { bookingReference, amountCents } = await request.json();

    if (!bookingReference || !amountCents) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "PayPal is not configured. Please contact us to complete payment." },
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

    const order = await createPayPalOrder(amountCents, booking.currency, bookingReference);
    const approveLink = order.links?.find((l: { rel: string }) => l.rel === "approve");

    if (!approveLink?.href) {
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const successUrl = `${baseUrl}/booking/success?reference=${bookingReference}&provider=paypal&verified=true&orderId=${order.id}`;
    const cancelUrl = `${baseUrl}/booking/cancelled?reference=${bookingReference}`;

    return NextResponse.json({
      redirectUrl: `${approveLink.href}`,
      orderId: order.id,
      successUrl,
      cancelUrl,
    });
  } catch {
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
