"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin/AdminUI";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useAdminToast } from "@/components/admin/AdminToast";

interface TripForm {
  title?: string;
  slug?: string;
  status?: string;
  destination?: string;
  durationDays?: number;
  shortDescription?: string;
  isBookable?: boolean;
  heroImage?: { url: string; alt: string };
}

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [trip, setTrip] = useState<TripForm | null>(null);
  const [heroUrl, setHeroUrl] = useState("");
  const [heroAlt, setHeroAlt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/trips/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const t = d.trip ?? null;
        setTrip(t);
        setHeroUrl(t?.heroImage?.url ?? "");
        setHeroAlt(t?.heroImage?.alt ?? "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!trip) return;
    setSaving(true);

    const res = await fetch(`/api/admin/trips/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: trip.title,
        status: trip.status,
        shortDescription: trip.shortDescription,
        isBookable: trip.isBookable,
        heroImage: heroUrl ? { url: heroUrl, alt: heroAlt || `${trip.title} hero image` } : undefined,
      }),
    });

    setSaving(false);

    if (res.ok) {
      showToast("Trip saved successfully", "success");
    } else {
      const data = await res.json();
      showToast(data.error ?? "Failed to save trip", "error");
    }
  }

  if (loading) return <p className="text-luxury-ink/50">Loading trip…</p>;
  if (!trip) return <p className="text-rich-berry">Trip not found</p>;

  return (
    <>
      <AdminPageHeader
        title={trip.title ?? "Edit Trip"}
        description={`Slug: ${trip.slug}`}
        action={
          <AdminButton variant="secondary" onClick={() => router.push("/admin/trips")}>
            Back to Trips
          </AdminButton>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input value={trip.title ?? ""} readOnly className="admin-input bg-warm-sand/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <input value={trip.status ?? ""} readOnly className="admin-input bg-warm-sand/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Destination</label>
                <input value={trip.destination ?? ""} readOnly className="admin-input bg-warm-sand/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Duration</label>
                <input value={`${trip.durationDays} days`} readOnly className="admin-input bg-warm-sand/20" />
              </div>
            </div>

            <AdminButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </AdminButton>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <LocalImageField
            value={heroUrl}
            onChange={setHeroUrl}
            folder="gallery"
            label="Hero Image"
          />
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">Image alt text</label>
            <input
              value={heroAlt}
              onChange={(e) => setHeroAlt(e.target.value)}
              placeholder="Describe the image for accessibility"
              className="admin-input"
            />
          </div>
        </AdminCard>
      </div>
    </>
  );
}
