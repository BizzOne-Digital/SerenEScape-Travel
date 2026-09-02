import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip } from "@/lib/models";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  if (!isDBConfigured()) {
    return jsonError("Database not configured", 503);
  }

  try {
    await connectDB();
    const trip = await Trip.findById(id).lean();
    if (!trip) return jsonError("Trip not found", 404);
    return jsonOk({ trip });
  } catch {
    return jsonError("Failed to fetch trip", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  if (!isDBConfigured()) {
    return jsonError("Database not configured", 503);
  }

  try {
    await connectDB();
    const body = await request.json();
    const trip = await Trip.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!trip) return jsonError("Trip not found", 404);
    return jsonOk({ trip });
  } catch {
    return jsonError("Failed to update trip", 500);
  }
}
