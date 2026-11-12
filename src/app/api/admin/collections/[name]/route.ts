import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";
import { COLLECTIONS, pickCollectionData } from "@/lib/admin/collections";
import { logAdminAction } from "@/lib/admin/audit";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ name: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { name } = await params;
  const config = COLLECTIONS[name];
  if (!config) return jsonError("Unknown collection", 404);
  if (!isDBConfigured()) return jsonOk({ items: [] });

  try {
    await connectDB();
    const items = await config.model.find().sort(config.sort).lean();
    return jsonOk({ items });
  } catch {
    return jsonError("Failed to load items", 500);
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  const { name } = await params;
  const config = COLLECTIONS[name];
  if (!config) return jsonError("Unknown collection", 404);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    const body = await request.json();
    const data = pickCollectionData(config, body);
    for (const field of config.required) {
      if (!data[field]) return jsonError(`${field} is required`);
    }
    await connectDB();
    const item = await config.model.create(data);
    await logAdminAction(session!.user.id, `${name}.create`, config.label, String(item._id));
    return jsonOk({ item }, 201);
  } catch (err) {
    console.error(`Create ${name} error:`, err);
    return jsonError("Failed to create item", 500);
  }
}
