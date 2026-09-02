import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking, Trip } from "@/lib/models";
import { generateBookingReference } from "@/lib/pricing";
import { generateSecureToken, hashToken } from "@/lib/security/tokens";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.tripSlug || !body.primaryTraveler?.email) {
      return NextResponse.json({ error: "Missing required booking data" }, { status: 400 });
    }

    if (!isDBConfigured()) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    await connectDB();

    const trip = await Trip.findOne({ slug: body.tripSlug, isBookable: true });
    if (!trip) {
      return NextResponse.json({ error: "Trip not available for booking" }, { status: 404 });
    }

    const spotsLeft = trip.capacity - trip.reservedCount;
    if (spotsLeft < body.travelerCount) {
      return NextResponse.json({ error: "Not enough spots available" }, { status: 400 });
    }

    const pricing = body.pricing;
    if (!pricing?.totalCents) {
      return NextResponse.json({ error: "Invalid pricing" }, { status: 400 });
    }

    const portalToken = generateSecureToken();
    const roomOption = trip.roomOptions?.find((r) => r.id === body.roomOptionId);
    const selectedExcursions = (trip.excursions ?? [])
      .filter((e) => body.excursionIds?.includes(e.id))
      .map((e) => ({ id: e.id, name: e.name, priceCents: e.priceCents }));

    const bookingReference = generateBookingReference();

    const booking = await Booking.create({
      bookingReference,
      tripId: trip._id,
      primaryTraveler: body.primaryTraveler,
      additionalTravelers: body.additionalTravelers ?? [],
      emergencyContact: body.emergencyContact,
      mailingAddress: body.mailingAddress,
      roomOption: roomOption
        ? { id: roomOption.id, name: roomOption.name, supplementCents: roomOption.supplementCents }
        : undefined,
      selectedExcursions,
      travelerCount: body.travelerCount,
      subtotalCents: pricing.subtotalCents,
      saleDiscountCents: pricing.saleDiscountCents ?? 0,
      payInFullDiscountCents: pricing.payInFullDiscountCents ?? 0,
      promoDiscountCents: pricing.promoDiscountCents ?? 0,
      totalCents: pricing.totalCents,
      amountPaidCents: 0,
      balanceCents: pricing.totalCents,
      currency: trip.currency,
      paymentChoice: body.paymentChoice,
      bookingStatus: "pending_payment",
      paymentStatus: "pending",
      termsAcceptedAt: body.termsAccepted ? new Date() : undefined,
      cancellationPolicyAcceptedAt: body.cancellationAccepted ? new Date() : undefined,
      newsletterConsent: body.newsletterConsent ?? false,
      securePortalTokenHash: hashToken(portalToken),
      roomPreference: body.roomPreference,
    });

    trip.reservedCount += body.travelerCount;
    await trip.save();

    return NextResponse.json({
      bookingReference: booking.bookingReference,
      portalToken,
      amountDueNowCents: pricing.amountDueNowCents,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
