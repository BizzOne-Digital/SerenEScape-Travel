export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function sanitizeFilename(filename: string): boolean {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return false;
  }
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

export function parseStoredUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  if (!url.startsWith("/api/uploads/")) return null;

  const parts = url.replace(/^\/api\/uploads\//, "").split("/");
  if (parts.length !== 2) return null;

  const [folder, filename] = parts;
  if (!isUploadFolder(folder) || !sanitizeFilename(filename)) return null;

  return { folder, filename };
}

export function buildStoredUploadUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}
