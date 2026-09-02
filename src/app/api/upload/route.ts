import { NextRequest } from "next/server";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { StoredUpload } from "@/lib/models/StoredUpload";
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  buildStoredUploadUrl,
  isUploadFolder,
  parseStoredUploadUrl,
} from "@/lib/uploads/constants";
import { generateUploadFilename, deleteStoredUploadByUrl } from "@/lib/uploads/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;

  if (!isDBConfigured()) {
    return jsonError("Database not configured", 503);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "");

    if (!(file instanceof File)) {
      return jsonError("No file provided");
    }

    if (!isUploadFolder(folder)) {
      return jsonError("Invalid folder. Use: products, gallery, pages, or misc");
    }

    if (!ALLOWED_MIME_TYPES[file.type]) {
      return jsonError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return jsonError("File too large. Maximum size is 8MB");
    }

    const filename = generateUploadFilename(file.type);
    if (!filename) {
      return jsonError("Could not determine file extension");
    }

    const bytes = await file.arrayBuffer();
    const data = Buffer.from(bytes);

    await connectDB();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: data.length,
      data,
    });

    return jsonOk({
      success: true,
      url: buildStoredUploadUrl(folder, filename),
      filename,
      size: data.length,
      folder,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return jsonError("Upload failed", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;

  if (!isDBConfigured()) {
    return jsonError("Database not configured", 503);
  }

  try {
    const body = await request.json();
    const url = String(body.url ?? "");

    if (!parseStoredUploadUrl(url)) {
      return jsonError("Invalid stored upload URL");
    }

    const deleted = await deleteStoredUploadByUrl(url);
    if (!deleted) {
      return jsonError("Upload not found", 404);
    }

    return jsonOk({ success: true });
  } catch {
    return jsonError("Delete failed", 500);
  }
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;

  if (!isDBConfigured()) {
    return jsonError("Database not configured", 503);
  }

  const folder = request.nextUrl.searchParams.get("folder");
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? 24), 100);

  try {
    await connectDB();
    const filter = folder && isUploadFolder(folder) ? { folder } : {};
    const uploads = await StoredUpload.find(filter)
      .select("folder filename mimeType size createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return jsonOk({
      uploads: uploads.map((u) => ({
        folder: u.folder,
        filename: u.filename,
        mimeType: u.mimeType,
        size: u.size,
        createdAt: u.createdAt,
        url: buildStoredUploadUrl(u.folder as Parameters<typeof buildStoredUploadUrl>[0], u.filename),
      })),
    });
  } catch {
    return jsonError("Failed to list uploads", 500);
  }
}
