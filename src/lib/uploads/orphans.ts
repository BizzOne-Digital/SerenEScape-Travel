import { deleteStoredUploadsByUrls } from "@/lib/uploads/storage";

const STORED_PREFIX = "/api/uploads/";

/** Walk any JSON-like value and collect every stored-upload URL it contains. */
export function collectStoredUrls(value: unknown, out: Set<string> = new Set(), depth = 0): Set<string> {
  if (depth > 12 || value === null || value === undefined) return out;

  if (typeof value === "string") {
    if (value.startsWith(STORED_PREFIX)) out.add(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectStoredUrls(v, out, depth + 1);
    return out;
  }
  if (typeof value === "object") {
    // Skip mongoose/bson internals such as ObjectId, Date, Buffer
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return out;
    for (const v of Object.values(value as Record<string, unknown>)) collectStoredUrls(v, out, depth + 1);
  }
  return out;
}

/**
 * After a successful save: delete uploads that were referenced BEFORE but are
 * no longer referenced AFTER. Runs server-side so a replaced picture is only
 * removed once the admin has actually saved (never leaves the live site with
 * a broken image because someone clicked Replace and walked away).
 */
export async function cleanupRemovedUploads(before: unknown, after: unknown): Promise<number> {
  const prev = collectStoredUrls(before);
  if (prev.size === 0) return 0;
  const next = collectStoredUrls(after);
  const removed = [...prev].filter((url) => !next.has(url));
  if (removed.length === 0) return 0;
  try {
    return await deleteStoredUploadsByUrls(removed);
  } catch (err) {
    console.error("[uploads] orphan cleanup failed", err);
    return 0;
  }
}
