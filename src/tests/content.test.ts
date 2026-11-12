import { describe, it, expect } from "vitest";
import { Binary } from "bson";
import { mergeContent, sanitizeContent } from "@/lib/content/merge";
import { CONTENT_DEFAULTS, CONTENT_PAGE_KEYS } from "@/lib/content/defaults";
import { CONTENT_SCHEMAS } from "@/lib/content/schema";
import { collectStoredUrls } from "@/lib/uploads/orphans";
import { toBuffer } from "@/lib/uploads/storage";
import { sanitizeTripPayload } from "@/lib/admin/trip-payload";

describe("mergeContent", () => {
  const defaults = {
    hero: { title: "Default", image: { url: "/a.jpg", alt: "A" }, pills: [{ text: "x" }, { text: "y" }] },
  };

  it("overrides text and keeps untouched defaults", () => {
    const out = mergeContent(defaults, { hero: { title: "Custom" } });
    expect(out.hero.title).toBe("Custom");
    expect(out.hero.image.url).toBe("/a.jpg");
  });

  it("falls back to the default when saved text is blank", () => {
    expect(mergeContent(defaults, { hero: { title: "" } }).hero.title).toBe("Default");
  });

  it("allows clearing an image url on purpose", () => {
    expect(mergeContent(defaults, { hero: { image: { url: "", alt: "" } } }).hero.image.url).toBe("");
  });

  it("replaces arrays so admins can delete items", () => {
    expect(mergeContent(defaults, { hero: { pills: [{ text: "only" }] } }).hero.pills).toEqual([{ text: "only" }]);
  });

  it("returns defaults for null/garbage overrides", () => {
    expect(mergeContent(defaults, null)).toBe(defaults);
    expect(mergeContent(defaults, "nope")).toEqual(defaults);
  });
});

describe("sanitizeContent", () => {
  it("drops mongo operator and dotted keys", () => {
    const out = sanitizeContent({ ok: "yes", $set: { a: 1 }, "a.b": "x", nested: { $where: "1" } }) as Record<string, unknown>;
    expect(out).toEqual({ ok: "yes", nested: {} });
  });
});

describe("content schema vs defaults", () => {
  it("every schema section/field exists in the defaults", () => {
    for (const page of CONTENT_SCHEMAS) {
      const defaults = CONTENT_DEFAULTS[page.key] as Record<string, Record<string, unknown>>;
      for (const section of page.sections) {
        expect(defaults[section.id], `${page.key}.${section.id}`).toBeDefined();
        for (const field of section.fields) {
          expect(field.key in defaults[section.id], `${page.key}.${section.id}.${field.key}`).toBe(true);
        }
      }
    }
  });

  it("has a schema for every content page", () => {
    expect(CONTENT_SCHEMAS.map((s) => s.key).sort()).toEqual([...CONTENT_PAGE_KEYS].sort());
  });
});

describe("stored upload helpers", () => {
  it("collects stored upload urls recursively and ignores other urls", () => {
    const urls = collectStoredUrls({
      hero: { url: "/api/uploads/pages/1-a.jpg" },
      list: [{ image: { url: "/api/uploads/gallery/2-b.png" } }, { image: { url: "/images/x.jpg" } }],
      legacy: "/uploads/old.jpg",
      when: new Date(),
    });
    expect([...urls].sort()).toEqual(["/api/uploads/gallery/2-b.png", "/api/uploads/pages/1-a.jpg"]);
  });

  it("converts a lean() BSON Binary to a real Buffer (Buffer.from(Binary) would be empty)", () => {
    const bytes = Buffer.from([1, 2, 3, 4, 5]);
    const bin = new Binary(bytes);
    const out = toBuffer(bin);
    expect(out).not.toBeNull();
    expect([...out!]).toEqual([1, 2, 3, 4, 5]);
    expect(toBuffer(bytes)).toBe(bytes);
    expect(toBuffer(null)).toBeNull();
  });
});

describe("sanitizeTripPayload", () => {
  it("whitelists fields and coerces values", () => {
    const { set, unset, error } = sanitizeTripPayload({
      title: " China ",
      slug: "China-2027",
      priceFromCents: "213600",
      reservedCount: 999, // must be ignored
      status: "booking_open",
      salePriceCents: null,
      heroImage: { url: "", alt: "" },
      inclusions: ["a", " ", "b"],
    });
    expect(error).toBeUndefined();
    expect(set.title).toBe("China");
    expect(set.slug).toBe("china-2027");
    expect(set.priceFromCents).toBe(213600);
    expect(set).not.toHaveProperty("reservedCount");
    expect(unset).toMatchObject({ salePriceCents: 1, heroImage: 1 });
    expect(set.inclusions).toEqual(["a", "b"]);
  });

  it("rejects bad slugs, statuses and group sizes", () => {
    expect(sanitizeTripPayload({ slug: "bad slug!" }).error).toBeTruthy();
    expect(sanitizeTripPayload({ status: "hacked" }).error).toBeTruthy();
    expect(sanitizeTripPayload({ groupMin: 30, groupMax: 10 }).error).toBeTruthy();
  });
});
