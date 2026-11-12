import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/connect";
import { StoredUpload } from "@/lib/models/StoredUpload";
import {
  ALLOWED_MIME_TYPES,
  parseStoredUploadUrl,
  sanitizeFilename,
  type UploadFolder,
} from "@/lib/uploads/constants";

export {
  UPLOAD_FOLDERS,
  MAX_UPLOAD_BYTES,
  ALLOWED_MIME_TYPES,
  isUploadFolder,
  sanitizeFilename,
  parseStoredUploadUrl,
  buildStoredUploadUrl,
  type UploadFolder,
} from "@/lib/uploads/constants";

export function generateUploadFilename(mimeType: string): string | null {
  const ext = ALLOWED_MIME_TYPES[mimeType];
  if (!ext) return null;
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) return false;

  await connectDB();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });

  return result.deletedCount > 0;
}

export async function getStoredUpload(folder: UploadFolder, filename: string) {
  if (!sanitizeFilename(filename)) return null;
  await connectDB();
  return StoredUpload.findOne({ folder, filename }).lean();
}

/**
 * Convert whatever Mongo/Mongoose hands back for a binary field into a Node Buffer.
 * `.lean()` returns a BSON `Binary` (not a Buffer); `Buffer.from(binary)` would
 * silently produce an EMPTY buffer, which would serve 0-byte images.
 */
export function toBuffer(raw: unknown): Buffer | null {
  if (!raw) return null;
  if (Buffer.isBuffer(raw)) return raw;
  if (raw instanceof Uint8Array) return Buffer.from(raw);

  const bin = raw as { buffer?: Uint8Array; position?: number; value?: () => unknown };
  if (bin.buffer instanceof Uint8Array) {
    const end = typeof bin.position === "number" ? bin.position : bin.buffer.length;
    return Buffer.from(bin.buffer.subarray(0, end));
  }
  return null;
}

/** Delete every stored upload referenced by the given URLs (ignores non-stored URLs). */
export async function deleteStoredUploadsByUrls(urls: string[]): Promise<number> {
  const unique = [...new Set(urls.filter((u) => typeof u === "string" && u.startsWith("/api/uploads/")))];
  let deleted = 0;
  for (const url of unique) {
    if (await deleteStoredUploadByUrl(url)) deleted += 1;
  }
  return deleted;
}
