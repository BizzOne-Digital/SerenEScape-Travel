import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip } from "@/lib/models";
import { jsonError, jsonOk } from "@/lib/api/helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!isDBConfigured()) {
    return jsonError("Trip not found", 404);
  }

  try {
    await connectDB();
    const trip = await Trip.findOne({ slug: slug.toLowerCase() }).lean();

    if (!trip) {
      return jsonError("Trip not found", 404);
    }

    if (trip.status === "draft") {
      return jsonError("Trip not found", 404);
    }

    return jsonOk({ trip });
  } catch {
    return jsonError("Failed to fetch trip", 500);
  }
}
