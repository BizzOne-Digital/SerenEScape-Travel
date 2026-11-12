/**
 * Deep merge of saved overrides onto defaults.
 * - plain objects merge key by key
 * - arrays from the override REPLACE the default array (so admins can delete items)
 * - empty-string / null / undefined overrides fall back to the default for
 *   scalar fields, so a blank field never leaves a hole in the page.
 *   (Image `url` is the exception — see mergeContent callers: an empty url is
 *   intentional for optional images, handled via `allowEmpty`.)
 */

type Json = unknown;

function isPlainObject(v: Json): v is Record<string, Json> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function mergeContent<T>(defaults: T, override: Json, allowEmptyKeys: string[] = ["url", "alt"]): T {
  if (override === undefined || override === null) return defaults;

  if (Array.isArray(defaults)) {
    return (Array.isArray(override) ? override : defaults) as T;
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(override)) return defaults;
    const out: Record<string, Json> = { ...defaults };
    for (const key of Object.keys(override)) {
      const base = (defaults as Record<string, Json>)[key];
      const next = override[key];
      if (base === undefined) {
        out[key] = next;
        continue;
      }
      if (typeof base === "string" && (next === "" || next === null) && !allowEmptyKeys.includes(key)) {
        continue; // keep default for blank text
      }
      out[key] = mergeContent(base, next, allowEmptyKeys);
    }
    return out as T;
  }

  if (typeof defaults === "string") {
    return (typeof override === "string" ? override : defaults) as T;
  }

  return (override ?? defaults) as T;
}

/** Strip values that are not plain JSON (functions, undefined) and cap depth/size. */
export function sanitizeContent(value: Json, depth = 0): Json {
  if (depth > 8) return null;
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.slice(0, 20000);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 100).map((v) => sanitizeContent(v, depth + 1));
  if (isPlainObject(value)) {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("$") || k.includes(".")) continue; // block Mongo operator / path injection
      out[k] = sanitizeContent(v, depth + 1);
    }
    return out;
  }
  return null;
}
