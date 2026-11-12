import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";
import { COLLECTIONS, pickCollectionData } from "@/lib/admin/collections";
import { cleanupRemovedUploads } from "@/lib/uploads/orphans";
import { logAdminAction } from "@/lib/admin/audit";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ name: string; id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  const { name, id } = await params;
  const config = COLLECTIONS[name];
  if (!config) return jsonError("Unknown collection", 404);
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid id", 400);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    const body = await request.json();
    const data = pickCollectionData(config, body);
    for (const field of config.required) {
      if (field in data && !data[field]) return jsonError(`${field} is required`);
    }
    await connectDB();
    const before = await config.model.findById(id).lean();
    if (!before) return jsonError("Not found", 404);
    const item = await config.model.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after", runValidators: true }).lean();
    const removed = await cleanupRemovedUploads(before, item);
    await logAdminAction(session!.user.id, `${name}.update`, config.label, id, { removedUploads: removed });
    return jsonOk({ item });
  } catch (err) {
    console.error(`Update ${name} error:`, err);
    return jsonError("Failed to update item", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  const { name, id } = await params;
  const config = COLLECTIONS[name];
  if (!config) return jsonError("Unknown collection", 404);
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid id", 400);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    await connectDB();
    const before = await config.model.findByIdAndDelete(id).lean();
    if (!before) return jsonError("Not found", 404);
    const removed = await cleanupRemovedUploads(before, {});
    await logAdminAction(session!.user.id, `${name}.delete`, config.label, id, { removedUploads: removed });
    return jsonOk({ success: true });
  } catch {
    return jsonError("Failed to delete item", 500);
  }
}
