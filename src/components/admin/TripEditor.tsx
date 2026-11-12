"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronDown, ExternalLink, Plus, Trash2 } from "lucide-react";
import { AdminButton, AdminCard } from "@/components/admin/AdminUI";
import { ImageValueField, type ImageValue } from "@/components/admin/ImageValueField";
import { useAdminToast } from "@/components/admin/AdminToast";
import { cn } from "@/lib/utils";

/* ---------- types (form state uses dollars & yyyy-mm-dd, API uses cents & ISO) ---------- */

type Img = ImageValue;
type Day = {
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  timeFrame: string;
  city: string;
  accommodation: string;
  transportation: string;
  meals: string;
  excursions: string;
  goodToKnow: string;
  images: Img[];
  published: boolean;
};
type Form = {
  title: string;
  slug: string;
  status: string;
  destination: string;
  cities: string;
  shortDescription: string;
  overview: string;
  featured: boolean;
  isBookable: boolean;
  startDate: string;
  endDate: string;
  durationDays: number;
  groupMin: number;
  groupMax: number;
  capacity: number;
  price: string;
  salePrice: string;
  deposit: string;
  payInFullDiscountPercent: number;
  paymentPlanEnabled: boolean;
  installmentCount: number;
  intervalDays: number;
  heroImage: Img;
  gallery: Img[];
  itinerary: Day[];
  accommodations: { name: string; description: string; city: string }[];
  roomOptions: { id: string; name: string; description: string; supplement: string }[];
  excursions: { id: string; name: string; description: string; price: string; dayNumber: string }[];
  inclusions: string;
  exclusions: string;
  meals: string;
  faqItems: { question: string; answer: string }[];
  cancellationSummary: string;
  seoTitle: string;
  seoDescription: string;
};

const STATUS_OPTIONS = [
  ["draft", "Draft (hidden)"],
  ["coming_soon", "Coming soon"],
  ["booking_open", "Booking open"],
  ["limited_spots", "Limited spots"],
  ["sold_out", "Sold out"],
  ["waitlist", "Waitlist"],
  ["completed", "Completed"],
];

/* ---------- conversion helpers ---------- */

const toDateInput = (v: unknown) => (v ? new Date(String(v)).toISOString().slice(0, 10) : "");
const centsToDollars = (c: unknown) => (c === undefined || c === null || c === "" ? "" : String(Number(c) / 100));
const dollarsToCents = (d: string) => (d.trim() === "" ? null : Math.round(Number(d) * 100));
const lines = (v: unknown) => (Array.isArray(v) ? (v as string[]).join("\n") : "");
const splitLines = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);
const splitCommas = (v: string) => v.split(",").map((x) => x.trim()).filter(Boolean);
const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function toForm(t: Raw): Form {
  return {
    title: t.title ?? "",
    slug: t.slug ?? "",
    status: t.status ?? "draft",
    destination: t.destination ?? "",
    cities: (t.cities ?? []).join(", "),
    shortDescription: t.shortDescription ?? "",
    overview: t.overview ?? "",
    featured: Boolean(t.featured),
    isBookable: Boolean(t.isBookable),
    startDate: toDateInput(t.startDate),
    endDate: toDateInput(t.endDate),
    durationDays: num(t.durationDays, 1),
    groupMin: num(t.groupMin, 8),
    groupMax: num(t.groupMax, 20),
    capacity: num(t.capacity, 20),
    price: centsToDollars(t.priceFromCents),
    salePrice: centsToDollars(t.salePriceCents),
    deposit: centsToDollars(t.depositCents),
    payInFullDiscountPercent: num(t.payInFullDiscountPercent, 5),
    paymentPlanEnabled: Boolean(t.paymentPlanEnabled),
    installmentCount: num(t.paymentScheduleTemplate?.installmentCount, 3),
    intervalDays: num(t.paymentScheduleTemplate?.intervalDays, 30),
    heroImage: { url: t.heroImage?.url ?? "", alt: t.heroImage?.alt ?? "" },
    gallery: (t.gallery ?? []).map((g: Raw) => ({ url: g.url ?? "", alt: g.alt ?? "" })),
    itinerary: (t.itinerary ?? []).map((d: Raw, i: number) => ({
      dayNumber: num(d.dayNumber, i + 1),
      date: toDateInput(d.date),
      title: d.title ?? "",
      description: d.description ?? "",
      timeFrame: d.timeFrame ?? "",
      city: d.city ?? "",
      accommodation: d.accommodation ?? "",
      transportation: d.transportation ?? "",
      meals: (d.mealsIncluded ?? []).join(", "),
      excursions: lines(d.excursionsIncluded),
      goodToKnow: d.goodToKnow ?? "",
      images: (d.images ?? []).map((g: Raw) => ({ url: g.url ?? "", alt: g.alt ?? "" })),
      published: d.published !== false,
    })),
    accommodations: (t.accommodations ?? []).map((a: Raw) => ({ name: a.name ?? "", description: a.description ?? "", city: a.city ?? "" })),
    roomOptions: (t.roomOptions ?? []).map((r: Raw) => ({
      id: r.id ?? "",
      name: r.name ?? "",
      description: r.description ?? "",
      supplement: centsToDollars(r.supplementCents ?? 0),
    })),
    excursions: (t.excursions ?? []).map((e: Raw) => ({
      id: e.id ?? "",
      name: e.name ?? "",
      description: e.description ?? "",
      price: centsToDollars(e.priceCents ?? 0),
      dayNumber: e.dayNumber === undefined || e.dayNumber === null ? "" : String(e.dayNumber),
    })),
    inclusions: lines(t.inclusions),
    exclusions: lines(t.exclusions),
    meals: lines(t.meals),
    faqItems: (t.faqItems ?? []).map((f: Raw) => ({ question: f.question ?? "", answer: f.answer ?? "" })),
    cancellationSummary: t.cancellationSummary ?? "",
    seoTitle: t.seo?.title ?? "",
    seoDescription: t.seo?.description ?? "",
  };
}

function toPayload(f: Form) {
  return {
    title: f.title,
    slug: f.slug,
    status: f.status,
    destination: f.destination,
    cities: splitCommas(f.cities),
    shortDescription: f.shortDescription,
    overview: f.overview,
    featured: f.featured,
    isBookable: f.isBookable,
    startDate: f.startDate || null,
    endDate: f.endDate || null,
    durationDays: f.durationDays,
    groupMin: f.groupMin,
    groupMax: f.groupMax,
    capacity: f.capacity,
    priceFromCents: dollarsToCents(f.price) ?? 0,
    salePriceCents: dollarsToCents(f.salePrice),
    depositCents: dollarsToCents(f.deposit) ?? 0,
    payInFullDiscountPercent: f.payInFullDiscountPercent,
    paymentPlanEnabled: f.paymentPlanEnabled,
    paymentScheduleTemplate: { installmentCount: f.installmentCount, intervalDays: f.intervalDays },
    heroImage: f.heroImage,
    gallery: f.gallery,
    itinerary: f.itinerary.map((d, i) => ({
      dayNumber: d.dayNumber || i + 1,
      date: d.date || null,
      title: d.title,
      description: d.description,
      timeFrame: d.timeFrame,
      city: d.city,
      accommodation: d.accommodation,
      transportation: d.transportation,
      mealsIncluded: splitCommas(d.meals),
      excursionsIncluded: splitLines(d.excursions),
      goodToKnow: d.goodToKnow,
      images: d.images,
      published: d.published,
    })),
    accommodations: f.accommodations,
    roomOptions: f.roomOptions.map((r) => ({ ...r, supplementCents: dollarsToCents(r.supplement) ?? 0 })),
    excursions: f.excursions.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      priceCents: dollarsToCents(e.price) ?? 0,
      dayNumber: e.dayNumber,
    })),
    inclusions: splitLines(f.inclusions),
    exclusions: splitLines(f.exclusions),
    meals: splitLines(f.meals),
    faqItems: f.faqItems,
    cancellationSummary: f.cancellationSummary,
    seo: { title: f.seoTitle, description: f.seoDescription },
  };
}

/* ---------- small UI pieces ---------- */

function Field({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-deep-aubergine">{label}</label>
      {children}
      {help && <p className="mt-1 text-xs text-luxury-ink/50">{help}</p>}
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <AdminCard className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-warm-sand/20"
      >
        <h2 className="font-display text-lg text-deep-aubergine">{title}</h2>
        <ChevronDown className={cn("h-5 w-5 text-luxury-ink/50 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="space-y-4 border-t border-warm-sand/60 px-6 py-5">{children}</div>}
    </AdminCard>
  );
}

function Repeater<T>({
  items,
  onChange,
  blank,
  label,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => T;
  label: string;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-warm-sand/70 bg-warm-sand/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-luxury-ink/50">
              {label} {i + 1}
            </p>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="rounded p-1 hover:bg-warm-sand/50 disabled:opacity-30" aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} className="rounded p-1 hover:bg-warm-sand/50 disabled:opacity-30" aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="rounded p-1 text-rich-berry hover:bg-rich-berry/10" aria-label={`Remove ${label}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {render(item, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))), i)}
          </div>
        </div>
      ))}
      <AdminButton variant="secondary" onClick={() => onChange([...items, blank()])}>
        <Plus className="mr-1 h-4 w-4" /> Add {label.toLowerCase()}
      </AdminButton>
    </div>
  );
}

function ImageList({ label, items, onChange }: { label: string; items: Img[]; onChange: (items: Img[]) => void }) {
  return (
    <Repeater
      items={items}
      onChange={onChange}
      blank={() => ({ url: "", alt: "" })}
      label={label}
      render={(img, update) => (
        <ImageValueField label="Picture" folder="gallery" value={img} onChange={(v) => update(v)} />
      )}
    />
  );
}

/* ---------- main editor ---------- */

export function TripEditor({ tripId }: { tripId: string }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [open, setOpen] = useState<string>("basics");

  useEffect(() => {
    fetch(`/api/admin/trips/${tripId}`)
      .then((r) => r.json())
      .then((d) => setForm(d.trip ? toForm(d.trip) : null))
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (loading) return <p className="text-luxury-ink/50">Loading trip…</p>;
  if (!form) return <p className="text-rich-berry">Trip not found</p>;

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((p) => (p ? { ...p, [key]: value } : p));
    setDirty(true);
  };
  const toggle = (id: string) => setOpen((o) => (o === id ? "" : id));

  async function save() {
    if (!form) return;
    if (!form.title.trim() || !form.slug.trim() || !form.destination.trim()) {
      showToast("Title, slug and destination are required", "error");
      setOpen("basics");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to save trip");
      setForm(toForm(data.trip));
      setDirty(false);
      showToast("Trip saved. The live site is updated.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save trip", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this trip permanently? Trips with bookings cannot be deleted (set to Draft instead).")) return;
    const res = await fetch(`/api/admin/trips/${tripId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(data.error ?? "Failed to delete trip", "error");
      return;
    }
    showToast("Trip deleted", "success");
    router.push("/admin/trips");
  }

  return (
    <div className="space-y-4 pb-24">
      <Section title="Basics" open={open === "basics"} onToggle={() => toggle("basics")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className="admin-input" />
          </Field>
          <Field label="URL slug" help="Used in the web address, e.g. /trips/china-2027. Changing it breaks old links.">
            <input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} className="admin-input" />
          </Field>
          <Field label="Destination">
            <input value={form.destination} onChange={(e) => set("destination", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Cities (comma separated)">
            <input value={form.cities} onChange={(e) => set("cities", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="admin-input">
              {STATUS_OPTIONS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4" />
              Featured on the homepage
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isBookable} onChange={(e) => set("isBookable", e.target.checked)} className="h-4 w-4" />
              Bookable online
            </label>
          </div>
        </div>
        <Field label="Short description (shown on trip cards)">
          <textarea rows={3} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className="admin-input" />
        </Field>
        <Field label="Overview (shown on the trip page)">
          <textarea rows={7} value={form.overview} onChange={(e) => set("overview", e.target.value)} className="admin-input" />
        </Field>
      </Section>

      <Section title="Pictures" open={open === "pictures"} onToggle={() => toggle("pictures")}>
        <ImageValueField
          label="Hero picture (trip card + top of trip page)"
          folder="products"
          value={form.heroImage}
          onChange={(v) => set("heroImage", v)}
        />
        <div>
          <p className="mb-2 text-sm font-medium text-deep-aubergine">Gallery</p>
          <ImageList label="Gallery picture" items={form.gallery} onChange={(v) => set("gallery", v)} />
        </div>
      </Section>

      <Section title="Dates, group size & pricing" open={open === "pricing"} onToggle={() => toggle("pricing")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Start date">
            <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="admin-input" />
          </Field>
          <Field label="End date">
            <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Duration (days)">
            <input type="number" min={1} value={form.durationDays} onChange={(e) => set("durationDays", Number(e.target.value))} className="admin-input" />
          </Field>
          <Field label="Group minimum">
            <input type="number" min={1} value={form.groupMin} onChange={(e) => set("groupMin", Number(e.target.value))} className="admin-input" />
          </Field>
          <Field label="Group maximum">
            <input type="number" min={1} value={form.groupMax} onChange={(e) => set("groupMax", Number(e.target.value))} className="admin-input" />
          </Field>
          <Field label="Total spots (capacity)">
            <input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", Number(e.target.value))} className="admin-input" />
          </Field>
          <Field label="Price from (USD)">
            <input type="number" min={0} step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Sale price (USD, optional)">
            <input type="number" min={0} step="0.01" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Deposit (USD)">
            <input type="number" min={0} step="0.01" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Pay-in-full discount (%)">
            <input type="number" min={0} max={100} value={form.payInFullDiscountPercent} onChange={(e) => set("payInFullDiscountPercent", Number(e.target.value))} className="admin-input" />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input type="checkbox" checked={form.paymentPlanEnabled} onChange={(e) => set("paymentPlanEnabled", e.target.checked)} className="h-4 w-4" />
            Payment plan available
          </label>
        </div>
        {form.paymentPlanEnabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number of installments">
              <input type="number" min={1} value={form.installmentCount} onChange={(e) => set("installmentCount", Number(e.target.value))} className="admin-input" />
            </Field>
            <Field label="Days between installments">
              <input type="number" min={1} value={form.intervalDays} onChange={(e) => set("intervalDays", Number(e.target.value))} className="admin-input" />
            </Field>
          </div>
        )}
      </Section>

      <Section title={`Itinerary (${form.itinerary.length} days)`} open={open === "itinerary"} onToggle={() => toggle("itinerary")}>
        <Repeater
          items={form.itinerary}
          onChange={(v) => set("itinerary", v)}
          label="Day"
          blank={() => ({
            dayNumber: form.itinerary.length + 1,
            date: "",
            title: "",
            description: "",
            timeFrame: "",
            city: "",
            accommodation: "",
            transportation: "",
            meals: "",
            excursions: "",
            goodToKnow: "",
            images: [],
            published: true,
          })}
          render={(day, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Day number">
                  <input type="number" min={1} value={day.dayNumber} onChange={(e) => update({ dayNumber: Number(e.target.value) })} className="admin-input" />
                </Field>
                <Field label="Date (optional)">
                  <input type="date" value={day.date} onChange={(e) => update({ date: e.target.value })} className="admin-input" />
                </Field>
                <Field label="City">
                  <input value={day.city} onChange={(e) => update({ city: e.target.value })} className="admin-input" />
                </Field>
              </div>
              <Field label="Title">
                <input value={day.title} onChange={(e) => update({ title: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Description">
                <textarea rows={4} value={day.description} onChange={(e) => update({ description: e.target.value })} className="admin-input" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Time frame">
                  <input value={day.timeFrame} onChange={(e) => update({ timeFrame: e.target.value })} className="admin-input" />
                </Field>
                <Field label="Accommodation">
                  <input value={day.accommodation} onChange={(e) => update({ accommodation: e.target.value })} className="admin-input" />
                </Field>
                <Field label="Transportation">
                  <input value={day.transportation} onChange={(e) => update({ transportation: e.target.value })} className="admin-input" />
                </Field>
                <Field label="Meals included (comma separated)">
                  <input value={day.meals} onChange={(e) => update({ meals: e.target.value })} placeholder="breakfast, dinner" className="admin-input" />
                </Field>
              </div>
              <Field label="Included excursions (one per line)">
                <textarea rows={3} value={day.excursions} onChange={(e) => update({ excursions: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Good to know">
                <textarea rows={2} value={day.goodToKnow} onChange={(e) => update({ goodToKnow: e.target.value })} className="admin-input" />
              </Field>
              <div>
                <p className="mb-2 text-sm font-medium text-deep-aubergine">Day pictures</p>
                <ImageList label="Picture" items={day.images} onChange={(images) => update({ images })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={day.published} onChange={(e) => update({ published: e.target.checked })} className="h-4 w-4" />
                Show this day on the site
              </label>
            </>
          )}
        />
      </Section>

      <Section title="Included / not included / meals" open={open === "lists"} onToggle={() => toggle("lists")}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="What's included (one per line)">
            <textarea rows={8} value={form.inclusions} onChange={(e) => set("inclusions", e.target.value)} className="admin-input" />
          </Field>
          <Field label="What's not included (one per line)">
            <textarea rows={8} value={form.exclusions} onChange={(e) => set("exclusions", e.target.value)} className="admin-input" />
          </Field>
          <Field label="Meals (one per line)">
            <textarea rows={8} value={form.meals} onChange={(e) => set("meals", e.target.value)} className="admin-input" />
          </Field>
        </div>
      </Section>

      <Section title="Accommodations, rooms & excursions" open={open === "stays"} onToggle={() => toggle("stays")}>
        <p className="text-sm font-medium text-deep-aubergine">Accommodations</p>
        <Repeater
          items={form.accommodations}
          onChange={(v) => set("accommodations", v)}
          label="Accommodation"
          blank={() => ({ name: "", description: "", city: "" })}
          render={(a, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name"><input value={a.name} onChange={(e) => update({ name: e.target.value })} className="admin-input" /></Field>
                <Field label="City"><input value={a.city} onChange={(e) => update({ city: e.target.value })} className="admin-input" /></Field>
              </div>
              <Field label="Description"><textarea rows={2} value={a.description} onChange={(e) => update({ description: e.target.value })} className="admin-input" /></Field>
            </>
          )}
        />
        <p className="pt-2 text-sm font-medium text-deep-aubergine">Room options (bookable)</p>
        <Repeater
          items={form.roomOptions}
          onChange={(v) => set("roomOptions", v)}
          label="Room option"
          blank={() => ({ id: "", name: "", description: "", supplement: "0" })}
          render={(r, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Name"><input value={r.name} onChange={(e) => update({ name: e.target.value })} className="admin-input" /></Field>
                <Field label="Extra cost (USD)"><input type="number" min={0} step="0.01" value={r.supplement} onChange={(e) => update({ supplement: e.target.value })} className="admin-input" /></Field>
                <Field label="ID" help="Keep unchanged for existing options."><input value={r.id} onChange={(e) => update({ id: e.target.value })} className="admin-input" /></Field>
              </div>
              <Field label="Description"><textarea rows={2} value={r.description} onChange={(e) => update({ description: e.target.value })} className="admin-input" /></Field>
            </>
          )}
        />
        <p className="pt-2 text-sm font-medium text-deep-aubergine">Optional excursions (bookable)</p>
        <Repeater
          items={form.excursions}
          onChange={(v) => set("excursions", v)}
          label="Excursion"
          blank={() => ({ id: "", name: "", description: "", price: "0", dayNumber: "" })}
          render={(x, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Name"><input value={x.name} onChange={(e) => update({ name: e.target.value })} className="admin-input" /></Field>
                <Field label="Price (USD)"><input type="number" min={0} step="0.01" value={x.price} onChange={(e) => update({ price: e.target.value })} className="admin-input" /></Field>
                <Field label="Day"><input type="number" min={1} value={x.dayNumber} onChange={(e) => update({ dayNumber: e.target.value })} className="admin-input" /></Field>
                <Field label="ID" help="Keep unchanged for existing options."><input value={x.id} onChange={(e) => update({ id: e.target.value })} className="admin-input" /></Field>
              </div>
              <Field label="Description"><textarea rows={2} value={x.description} onChange={(e) => update({ description: e.target.value })} className="admin-input" /></Field>
            </>
          )}
        />
      </Section>

      <Section title="Trip FAQs, cancellation & SEO" open={open === "extras"} onToggle={() => toggle("extras")}>
        <Repeater
          items={form.faqItems}
          onChange={(v) => set("faqItems", v)}
          label="Question"
          blank={() => ({ question: "", answer: "" })}
          render={(f, update) => (
            <>
              <Field label="Question"><input value={f.question} onChange={(e) => update({ question: e.target.value })} className="admin-input" /></Field>
              <Field label="Answer"><textarea rows={3} value={f.answer} onChange={(e) => update({ answer: e.target.value })} className="admin-input" /></Field>
            </>
          )}
        />
        <Field label="Cancellation summary">
          <textarea rows={4} value={form.cancellationSummary} onChange={(e) => set("cancellationSummary", e.target.value)} className="admin-input" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SEO title"><input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className="admin-input" /></Field>
          <Field label="SEO description"><textarea rows={2} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className="admin-input" /></Field>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-warm-sand/60 bg-soft-ivory/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className={cn("text-sm", dirty ? "font-medium text-burnt-orange" : "text-luxury-ink/50")}>
            {dirty ? "You have unsaved changes" : "All changes saved"}
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/trips/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-warm-sand bg-white px-4 py-2 text-sm font-medium text-deep-aubergine hover:bg-warm-sand/30"
            >
              <ExternalLink className="h-4 w-4" /> View
            </a>
            <AdminButton variant="danger" onClick={remove} disabled={saving}>
              Delete trip
            </AdminButton>
            <AdminButton onClick={save} disabled={saving || !dirty}>
              {saving ? "Saving…" : "Save trip"}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
