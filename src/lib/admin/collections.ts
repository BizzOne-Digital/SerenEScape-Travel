import type { Model } from "mongoose";
import { FAQ, Founder, Testimonial } from "@/lib/models";

type FieldKind = "string" | "number" | "boolean" | "image";

export type CollectionConfig = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  fields: Record<string, FieldKind>;
  required: string[];
  sort: Record<string, 1 | -1>;
};

/** Server-side whitelist: only these fields can be written from the admin API. */
export const COLLECTIONS: Record<string, CollectionConfig> = {
  faqs: {
    label: "FAQ",
    model: FAQ,
    fields: { category: "string", question: "string", answer: "string", order: "number", published: "boolean", isDraft: "boolean" },
    required: ["category", "question", "answer"],
    sort: { category: 1, order: 1 },
  },
  founders: {
    label: "Founder",
    model: Founder,
    fields: { name: "string", title: "string", bio: "string", welcomeNote: "string", image: "image", order: "number", published: "boolean", isPlaceholder: "boolean" },
    required: ["name"],
    sort: { order: 1 },
  },
  testimonials: {
    label: "Testimonial",
    model: Testimonial,
    fields: { name: "string", location: "string", tripTitle: "string", content: "string", rating: "number", image: "image", approved: "boolean", featured: "boolean" },
    required: ["content"],
    sort: { createdAt: -1 },
  },
};

export function pickCollectionData(config: CollectionConfig, body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const [key, kind] of Object.entries(config.fields)) {
    if (!(key in body)) continue;
    const v = body[key];
    if (kind === "string") data[key] = typeof v === "string" ? v.trim().slice(0, 10000) : "";
    else if (kind === "number") {
      const n = Number(v);
      data[key] = Number.isFinite(n) ? n : 0;
    } else if (kind === "boolean") data[key] = Boolean(v);
    else if (kind === "image") {
      const o = (v ?? {}) as { url?: unknown; alt?: unknown };
      data[key] = { url: typeof o.url === "string" ? o.url : "", alt: typeof o.alt === "string" ? o.alt : "" };
    }
  }
  return data;
}
