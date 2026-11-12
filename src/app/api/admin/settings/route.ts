import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { SiteSettings } from "@/lib/models";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";
import { cleanupRemovedUploads } from "@/lib/uploads/orphans";
import { logAdminAction } from "@/lib/admin/audit";

export const runtime = "nodejs";

const STRING_FIELDS = [
  "businessName",
  "tagline",
  "email",
  "phone",
  "facebookUrl",
  "logoUrl",
  "faviconUrl",
  "footerTagline",
  "contactRecipientEmail",
  "aboutContent",
  "privacyPolicy",
  "bookingTerms",
  "cancellationPolicy",
  "accessibilityStatement",
  "paymentPlanWording",
  "analyticsId",
  "metaPixelId",
] as const;

const BOOLEAN_FIELDS = ["maintenanceMode", "paypalEnabled", "squareEnabled", "manualPaymentEnabled"] as const;

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    return jsonOk({ settings: settings ?? null });
  } catch {
    return jsonError("Failed to load settings", 500);
  }
}

export async function PUT(request: NextRequest) {
  const { session, error } = await requireAdminApi();
  if (error) return error;
  if (!isDBConfigured()) return jsonError("Database not configured", 503);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    for (const key of STRING_FIELDS) {
      if (key in body) data[key] = typeof body[key] === "string" ? (body[key] as string).trim() : "";
    }
    for (const key of BOOLEAN_FIELDS) {
      if (key in body) data[key] = Boolean(body[key]);
    }
    if (body.defaultSeo && typeof body.defaultSeo === "object") {
      const seo = body.defaultSeo as { title?: unknown; description?: unknown };
      data.defaultSeo = {
        title: typeof seo.title === "string" ? seo.title : "",
        description: typeof seo.description === "string" ? seo.description : "",
      };
    }

    if (typeof data.email === "string" && data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      return jsonError("Email address is not valid");
    }

    await connectDB();
    const before = await SiteSettings.findOne().lean();
    const after = before
      ? await SiteSettings.findByIdAndUpdate(before._id, { $set: data }, { returnDocument: "after", runValidators: true }).lean()
      : (await SiteSettings.create(data)).toObject();

    const removed = await cleanupRemovedUploads(before, after);
    await logAdminAction(session!.user.id, "settings.update", "SiteSettings", String(after?._id), {
      fields: Object.keys(data),
      removedUploads: removed,
    });

    return jsonOk({ success: true, settings: after });
  } catch (err) {
    console.error("Save settings error:", err);
    return jsonError("Failed to save settings", 500);
  }
}
