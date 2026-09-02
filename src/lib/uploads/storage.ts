import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/connect";
import { StoredUpload } from "@/lib/models/StoredUpload";
import {
  ALLOWED_MIME_TYPES,
  buildStoredUploadUrl,
  isUploadFolder,
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
