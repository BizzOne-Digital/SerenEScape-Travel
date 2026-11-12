import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { Trip, Booking } from "@/lib/models";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";
import { cleanupRemovedUploads } from "@/lib/uploads/orphans";
import { logAdminAction } from "@/lib/admin/audit";
import { sanitizeTripPayload } from "@/lib/admin/trip-payload";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid trip id", 400);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    await connectDB();
    const trip = await Trip.findById(id).lean();
    if (!trip) return jsonError("Trip not found", 404);
    return jsonOk({ trip });
  } catch {
    return jsonError("Failed to fetch trip", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid trip id", 400);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    await connectDB();
    const body = await request.json();
    const { set, unset, error: payloadError } = sanitizeTripPayload(body);
    if (payloadError) return jsonError(payloadError);

    if (typeof set.slug === "string") {
      const clash = await Trip.findOne({ slug: set.slug, _id: { $ne: id } }).select("_id").lean();
      if (clash) return jsonError("Another trip already uses this slug", 409);
    }

    const before = await Trip.findById(id).lean();
    if (!before) return jsonError("Trip not found", 404);

    const update: Record<string, unknown> = { $set: set };
    if (Object.keys(unset).length > 0) update.$unset = unset;

    const trip = await Trip.findByIdAndUpdate(id, update, { returnDocument: "after", runValidators: true }).lean();
    if (!trip) return jsonError("Trip not found", 404);

    const removed = await cleanupRemovedUploads(before, trip);
    await logAdminAction(session!.user.id, "trip.update", "Trip", id, {
      fields: Object.keys(set),
      removedUploads: removed,
    });

    return jsonOk({ trip });
  } catch (err) {
    console.error("Update trip error:", err);
    return jsonError("Failed to update trip", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid trip id", 400);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    await connectDB();
    const bookings = await Booking.countDocuments({ tripId: id });
    if (bookings > 0) {
      return jsonError(
        `This trip has ${bookings} booking(s) and cannot be deleted. Set its status to Draft to hide it instead.`,
        409
      );
    }

    const before = await Trip.findByIdAndDelete(id).lean();
    if (!before) return jsonError("Trip not found", 404);

    const removed = await cleanupRemovedUploads(before, {});
    await logAdminAction(session!.user.id, "trip.delete", "Trip", id, { removedUploads: removed });
    return jsonOk({ success: true });
  } catch {
    return jsonError("Failed to delete trip", 500);
  }
}
