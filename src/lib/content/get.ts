import { connection } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { PageContent as PageContentModel } from "@/lib/models/PageContent";
import {
  CONTENT_DEFAULTS,
  type ContentPageKey,
  type PageContent,
} from "@/lib/content/defaults";
import { mergeContent } from "@/lib/content/merge";

/** Defaults + whatever the admin saved. Safe to call from route handlers. */
export async function loadPageContent<K extends ContentPageKey>(key: K): Promise<PageContent<K>> {
  const defaults = CONTENT_DEFAULTS[key] as unknown as PageContent<K>;
  if (!isDBConfigured()) return defaults;

  try {
    await connectDB();
    const doc = await PageContentModel.findOne({ key }).lean();
    if (!doc?.data) return defaults;
    return mergeContent(defaults, doc.data);
  } catch (err) {
    console.error(`[content] failed to load "${key}", using defaults`, err);
    return defaults;
  }
}

/**
 * For public pages / layouts. `connection()` opts the page out of build-time
 * prerendering so admin edits show up on the next request (no redeploy, no
 * manual revalidation needed).
 */
export async function getPageContent<K extends ContentPageKey>(key: K): Promise<PageContent<K>> {
  await connection();
  return loadPageContent(key);
}

/** Convenience for generateMetadata(): title + description from the page's SEO section. */
export async function getPageSeo(key: Exclude<ContentPageKey, "global">) {
  const content = await getPageContent(key);
  const seo = (content as { seo: { title: string; description: string } }).seo;
  return { title: seo.title, description: seo.description };
}
