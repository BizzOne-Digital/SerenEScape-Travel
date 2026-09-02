import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip } from "@/lib/models";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";

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

    const existing = await Trip.findOne({ slug: body.slug.toLowerCase() });
    if (existing) {
      return jsonError("A trip with this slug already exists", 409);
    }

    const trip = await Trip.create({
      ...body,
      slug: body.slug.toLowerCase(),
      status: body.status ?? "draft",
      createdBy: session!.user.id,
    });

    return jsonOk({ trip }, 201);
  } catch (err) {
    console.error("Create trip error:", err);
    return jsonError("Failed to create trip", 500);
  }
}
