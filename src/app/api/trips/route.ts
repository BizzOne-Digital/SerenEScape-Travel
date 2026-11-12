import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip } from "@/lib/models";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";
import { sanitizeTripPayload } from "@/lib/admin/trip-payload";
import { logAdminAction } from "@/lib/admin/audit";

const PUBLIC_STATUSES = [
  "coming_soon",
  "booking_open",
  "limited_spots",
  "sold_out",
  "waitlist",
  "completed",
] as const;

export async function GET(request: NextRequest) {
  if (!isDBConfigured()) {
    return jsonOk({ trips: [] });
  }

  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");
    const { session } = await requireAdminApi();
    const isAdmin = Boolean(session);

    const filter: Record<string, unknown> = isAdmin ? {} : { status: { $in: PUBLIC_STATUSES } };
    if (featured === "true") filter.featured = true;
    if (status) filter.status = status;

    const trips = await Trip.find(filter)
      .select(
        "title slug shortDescription destination cities startDate endDate durationDays priceFromCents salePriceCents currency depositCents status featured heroImage capacity reservedCount isBookable"
      )
      .sort({ startDate: 1, featured: -1 })
      .lean();

    return jsonOk({ trips });
  } catch {
    return jsonError("Failed to fetch trips", 500);
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  if (!isDBConfigured()) {
    return jsonError("Database not configured", 503);
  }

  try {
    await connectDB();
    const body = await request.json();

    if (!body.title || !body.slug || !body.destination || !body.durationDays || !body.priceFromCents) {
      return jsonError("Missing required fields: title, slug, destination, durationDays, priceFromCents");
    }

    const { set, unset, error: payloadError } = sanitizeTripPayload(body);
    if (payloadError) return jsonError(payloadError);
    for (const key of Object.keys(unset)) delete set[key];

    const existing = await Trip.findOne({ slug: String(set.slug) });
    if (existing) {
      return jsonError("A trip with this slug already exists", 409);
    }

    const trip = await Trip.create({ status: "draft", ...set });
    await logAdminAction(session!.user.id, "trip.create", "Trip", String(trip._id));

    return jsonOk({ trip }, 201);
  } catch (err) {
    console.error("Create trip error:", err);
    return jsonError("Failed to create trip", 500);
  }
}
