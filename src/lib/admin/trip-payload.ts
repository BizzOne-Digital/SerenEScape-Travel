/**
 * Whitelist + coerce the trip editor payload. Anything not listed here
 * (reservedCount, createdAt, _id, ...) can never be written from the admin form.
 */

const STATUSES = ["draft", "coming_soon", "booking_open", "limited_spots", "sold_out", "waitlist", "completed"];

const str = (v: unknown, max = 20000): string => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const strList = (v: unknown, max = 100): string[] =>
  Array.isArray(v) ? v.map((x) => str(x, 500)).filter(Boolean).slice(0, max) : [];
const image = (v: unknown) => {
  const o = (v ?? {}) as { url?: unknown; alt?: unknown };
  return { url: str(o.url, 2000), alt: str(o.alt, 500) };
};
const arr = (v: unknown, max = 100): Record<string, unknown>[] =>
  Array.isArray(v) ? (v.slice(0, max).filter((x) => x && typeof x === "object") as Record<string, unknown>[]) : [];
const dateOrNull = (v: unknown): Date | null => {
  if (!v) return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
};

export function sanitizeTripPayload(body: Record<string, unknown>): {
  set: Record<string, unknown>;
  unset: Record<string, 1>;
  error?: string;
} {
  const set: Record<string, unknown> = {};
  const unset: Record<string, 1> = {};
  const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);

  for (const k of ["title", "destination", "currency"] as const) {
    if (has(k)) {
      const v = str(body[k], 300);
      if (!v) return { set, unset, error: `${k} cannot be empty` };
      set[k] = k === "currency" ? v.toUpperCase() : v;
    }
  }
  if (has("slug")) {
    const slug = str(body.slug, 200).toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return { set, unset, error: "Slug may only contain lowercase letters, numbers and hyphens" };
    }
    set.slug = slug;
  }
  for (const k of ["shortDescription", "overview", "cancellationSummary"] as const) {
    if (has(k)) set[k] = str(body[k]);
  }

  for (const k of ["durationDays", "groupMin", "groupMax", "capacity", "priceFromCents", "depositCents", "payInFullDiscountPercent"] as const) {
    if (has(k)) set[k] = Math.max(0, Math.round(num(body[k])));
  }
  if (has("salePriceCents")) {
    if (body.salePriceCents === null || body.salePriceCents === "" || body.salePriceCents === undefined) unset.salePriceCents = 1;
    else set.salePriceCents = Math.max(0, Math.round(num(body.salePriceCents)));
  }

  for (const k of ["paymentPlanEnabled", "featured", "isBookable"] as const) {
    if (has(k)) set[k] = Boolean(body[k]);
  }

  if (has("status")) {
    if (!STATUSES.includes(String(body.status))) return { set, unset, error: "Invalid status" };
    set.status = body.status;
  }

  for (const k of ["startDate", "endDate", "bookingOpenAt", "bookingCloseAt"] as const) {
    if (has(k)) {
      const d = dateOrNull(body[k]);
      if (d) set[k] = d;
      else unset[k] = 1;
    }
  }

  for (const k of ["cities", "inclusions", "exclusions", "meals"] as const) {
    if (has(k)) set[k] = strList(body[k]);
  }

  if (has("heroImage")) {
    const hero = image(body.heroImage);
    if (hero.url) set.heroImage = hero;
    else unset.heroImage = 1;
  }

  if (has("gallery")) {
    set.gallery = arr(body.gallery, 60)
      .map((g, i) => ({ ...image(g), order: i }))
      .filter((g) => g.url);
  }

  if (has("itinerary")) {
    set.itinerary = arr(body.itinerary, 60).map((d, i) => ({
      dayNumber: Math.max(1, Math.round(num(d.dayNumber, i + 1))),
      date: dateOrNull(d.date) ?? undefined,
      title: str(d.title, 300),
      description: str(d.description),
      timeFrame: str(d.timeFrame, 200),
      city: str(d.city, 200),
      accommodation: str(d.accommodation, 300),
      transportation: str(d.transportation, 300),
      mealsIncluded: strList(d.mealsIncluded, 10),
      excursionsIncluded: strList(d.excursionsIncluded, 30),
      optionalExcursions: arr(d.optionalExcursions, 20).map((e) => ({
        name: str(e.name, 300),
        priceCents: Math.max(0, Math.round(num(e.priceCents))),
      })),
      goodToKnow: str(d.goodToKnow),
      images: arr(d.images, 12).map(image).filter((im) => im.url),
      published: d.published === undefined ? true : Boolean(d.published),
    }));
  }

  if (has("accommodations")) {
    set.accommodations = arr(body.accommodations, 40)
      .map((a) => ({ name: str(a.name, 300), description: str(a.description), city: str(a.city, 200) }))
      .filter((a) => a.name);
  }
  if (has("roomOptions")) {
    set.roomOptions = arr(body.roomOptions, 20)
      .map((r, i) => ({
        id: str(r.id, 100) || `room-${i + 1}`,
        name: str(r.name, 300),
        description: str(r.description),
        supplementCents: Math.max(0, Math.round(num(r.supplementCents))),
      }))
      .filter((r) => r.name);
  }
  if (has("excursions")) {
    set.excursions = arr(body.excursions, 40)
      .map((e, i) => ({
        id: str(e.id, 100) || `excursion-${i + 1}`,
        name: str(e.name, 300),
        description: str(e.description),
        priceCents: Math.max(0, Math.round(num(e.priceCents))),
        dayNumber: e.dayNumber === "" || e.dayNumber == null ? undefined : Math.round(num(e.dayNumber)),
      }))
      .filter((e) => e.name);
  }
  if (has("faqItems")) {
    set.faqItems = arr(body.faqItems, 40)
      .map((f) => ({ question: str(f.question, 500), answer: str(f.answer) }))
      .filter((f) => f.question && f.answer);
  }
  if (has("seo")) {
    const s = (body.seo ?? {}) as Record<string, unknown>;
    set.seo = { title: str(s.title, 300), description: str(s.description, 600), ogImage: str(s.ogImage, 2000) };
  }
  if (has("paymentScheduleTemplate")) {
    const p = (body.paymentScheduleTemplate ?? {}) as Record<string, unknown>;
    set.paymentScheduleTemplate = {
      installmentCount: Math.max(1, Math.round(num(p.installmentCount, 1))),
      intervalDays: Math.max(1, Math.round(num(p.intervalDays, 30))),
      finalDeadline: dateOrNull(p.finalDeadline) ?? undefined,
    };
  }

  if (set.groupMin !== undefined && set.groupMax !== undefined && (set.groupMin as number) > (set.groupMax as number)) {
    return { set, unset, error: "Minimum group size cannot be larger than the maximum" };
  }

  return { set, unset };
}
