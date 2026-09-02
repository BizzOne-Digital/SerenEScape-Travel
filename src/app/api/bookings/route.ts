import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Booking, Trip, PromoCode } from "@/lib/models";
import { calculatePricing, generateBookingReference } from "@/lib/pricing";
import { validatePromoCode } from "@/lib/pricing/promo";
import { generateSecureToken, hashToken } from "@/lib/security/tokens";
import {
  bookingStep1Schema,
  bookingStep2Schema,
  bookingStep3Schema,
} from "@/lib/validation/schemas";
import { jsonError, jsonOk } from "@/lib/api/helpers";

const createBookingSchema = z.object({
  step1: bookingStep1Schema,
  step2: bookingStep2Schema,
  step3: bookingStep3Schema,
  promoCode: z.string().optional(),
  termsAccepted: z.boolean(),
  cancellationPolicyAccepted: z.boolean(),
  newsletterConsent: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid booking data");
    }

    if (!parsed.data.termsAccepted || !parsed.data.cancellationPolicyAccepted) {
      return jsonError("You must accept the terms and cancellation policy");
    }

    if (!isDBConfigured()) {
      return jsonError("Service unavailable", 503);
    }

    await connectDB();
    const { step1, step2, step3 } = parsed.data;

    const trip = await Trip.findOne({ slug: step1.tripSlug.toLowerCase() });
    if (!trip) {
      return jsonError("Trip not found", 404);
    }

    if (!trip.isBookable) {
      return jsonError("This trip is not currently accepting bookings");
    }

    const roomOption = step1.roomOptionId
      ? trip.roomOptions.find((r) => r.id === step1.roomOptionId)
      : undefined;

    const selectedExcursions = (step1.excursionIds ?? [])
      .map((id) => trip.excursions.find((e) => e.id === id))
      .filter(Boolean) as { id: string; name: string; priceCents: number }[];

    const excursionTotalCents = selectedExcursions.reduce((sum, e) => sum + e.priceCents, 0);
    const roomSupplementCents = (roomOption?.supplementCents ?? 0) * step1.travelerCount;

    let promoCodeId;
    let promoDiscountCents = 0;

    if (parsed.data.promoCode) {
      const promo = await PromoCode.findOne({ code: parsed.data.promoCode.toUpperCase() });
      const baseSubtotal =
        (trip.salePriceCents && trip.salePriceCents < trip.priceFromCents
          ? trip.salePriceCents
          : trip.priceFromCents) *
          step1.travelerCount +
        excursionTotalCents +
        roomSupplementCents;

      const validation = validatePromoCode(promo, {
        subtotalCents: baseSubtotal,
        tripId: trip._id.toString(),
        email: step2.primaryTraveler.email,
      });

      if (!validation.valid) {
        return jsonError(validation.error ?? "Invalid promo code");
      }

      promoDiscountCents = validation.discountCents ?? 0;
      promoCodeId = promo?._id;
    }

    const pricing = calculatePricing({
      priceFromCents: trip.priceFromCents,
      salePriceCents: trip.salePriceCents,
      travelerCount: step1.travelerCount,
      excursionTotalCents,
      roomSupplementCents,
      paymentChoice: step3.paymentChoice,
      promoDiscountCents,
      payInFullDiscountPercent: trip.payInFullDiscountPercent,
      depositCents: trip.depositCents,
    });

    const portalToken = generateSecureToken();
    const bookingReference = generateBookingReference();

    const booking = await Booking.create({
      bookingReference,
      tripId: trip._id,
      primaryTraveler: step2.primaryTraveler,
      additionalTravelers: step2.additionalTravelers ?? [],
      emergencyContact: step2.emergencyContact,
      mailingAddress: step2.mailingAddress,
      roomOption: roomOption
        ? { id: roomOption.id, name: roomOption.name, supplementCents: roomOption.supplementCents }
        : undefined,
      selectedExcursions,
      travelerCount: step1.travelerCount,
      subtotalCents: pricing.subtotalCents,
      saleDiscountCents: pricing.saleDiscountCents,
      payInFullDiscountCents: pricing.payInFullDiscountCents,
      promoDiscountCents: pricing.promoDiscountCents,
      totalCents: pricing.totalCents,
      amountPaidCents: 0,
      balanceCents: pricing.totalCents,
      currency: trip.currency,
      paymentChoice: step3.paymentChoice,
      promoCodeId,
      bookingStatus: "pending_payment",
      paymentStatus: "pending",
      termsAcceptedAt: new Date(),
      cancellationPolicyAcceptedAt: new Date(),
      newsletterConsent: parsed.data.newsletterConsent ?? false,
      securePortalTokenHash: hashToken(portalToken),
      roomPreference: step2.roomPreference,
    });

    if (promoCodeId) {
      await PromoCode.updateOne({ _id: promoCodeId }, { $inc: { redemptionCount: 1 } });
    }

    return jsonOk(
      {
        booking: {
          id: booking._id,
          bookingReference: booking.bookingReference,
          totalCents: booking.totalCents,
          amountDueNowCents: pricing.amountDueNowCents,
          paymentChoice: booking.paymentChoice,
          currency: booking.currency,
        },
        portalToken,
      },
      201
    );
  } catch (err) {
    console.error("Create booking error:", err);
    return jsonError("Failed to create booking", 500);
  }
}
