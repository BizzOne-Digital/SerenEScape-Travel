import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { PageContent } from "@/lib/models/PageContent";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";
import { CONTENT_DEFAULTS, isContentPageKey } from "@/lib/content/defaults";
import { loadPageContent } from "@/lib/content/get";
import { sanitizeContent } from "@/lib/content/merge";
import { cleanupRemovedUploads } from "@/lib/uploads/orphans";
import { logAdminAction } from "@/lib/admin/audit";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ key: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { key } = await params;
  if (!isContentPageKey(key)) return jsonError("Unknown page", 404);

  const content = await loadPageContent(key);
  return jsonOk({ content, defaults: CONTENT_DEFAULTS[key] });
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { key } = await params;
  if (!isContentPageKey(key)) return jsonError("Unknown page", 404);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    const body = await request.json();
    if (!body || typeof body.content !== "object" || Array.isArray(body.content)) {
      return jsonError("Invalid content");
    }

    // Only keep sections that exist for this page.
    const allowedSections = Object.keys(CONTENT_DEFAULTS[key]);
    const clean = sanitizeContent(body.content) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const section of allowedSections) {
      if (clean[section] !== undefined && clean[section] !== null) data[section] = clean[section];
    }

    await connectDB();
    const before = await PageContent.findOne({ key }).lean();
    await PageContent.findOneAndUpdate(
      { key },
      { $set: { data, updatedBy: session!.user.id } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    const removed = await cleanupRemovedUploads(before?.data, data);
    await logAdminAction(session!.user.id, "content.update", "PageContent", key, { removedUploads: removed });

    return jsonOk({ success: true, removedUploads: removed });
  } catch (err) {
    console.error("Save content error:", err);
    return jsonError("Failed to save content", 500);
  }
}

/** Reset a page back to the built-in defaults. */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { session, error } = await requireAdminApi();
  if (error) return error;

  const { key } = await params;
  if (!isContentPageKey(key)) return jsonError("Unknown page", 404);
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    await connectDB();
    const before = await PageContent.findOneAndDelete({ key }).lean();
    const removed = await cleanupRemovedUploads(before?.data, {});
    await logAdminAction(session!.user.id, "content.reset", "PageContent", key);
    return jsonOk({ success: true, removedUploads: removed });
  } catch {
    return jsonError("Failed to reset content", 500);
  }
}
