/** Placeholder when legacy disk `/uploads/...` URLs are encountered */
export const LEGACY_UPLOAD_PLACEHOLDER = "/images/founders-duo.jpg";

export function isLegacyDiskUploadUrl(src: string): boolean {
  return src.startsWith("/uploads/") && !src.startsWith("/api/uploads/");
}

export function resolveImageSrc(src?: string | null): string {
  if (!src) return LEGACY_UPLOAD_PLACEHOLDER;
  if (isLegacyDiskUploadUrl(src)) return LEGACY_UPLOAD_PLACEHOLDER;
  return src;
}

export function isStoredUploadUrl(src: string): boolean {
  return src.startsWith("/api/uploads/");
}
