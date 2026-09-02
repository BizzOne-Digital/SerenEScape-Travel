"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin/AdminUI";

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      slug: form.get("slug"),
      destination: form.get("destination"),
      durationDays: Number(form.get("durationDays")),
      priceFromCents: Math.round(Number(form.get("price")) * 100),
      depositCents: Math.round(Number(form.get("deposit")) * 100),
      capacity: Number(form.get("capacity")),
      status: form.get("status") ?? "draft",
      shortDescription: form.get("shortDescription"),
    };

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create trip");
      return;
    }

    const data = await res.json();
    router.push(`/admin/trips/${data.trip._id}/edit`);
  }

  return (
    <>
      <AdminPageHeader title="New Trip" description="Create a new travel experience" />

      <AdminCard className="max-w-2xl p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-rich-berry/10 px-4 py-3 text-sm text-rich-berry">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input name="title" required className="admin-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <input name="slug" required placeholder="china-2026" className="admin-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Destination</label>
            <input name="destination" required className="admin-input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Duration (days)</label>
              <input name="durationDays" type="number" required defaultValue={10} className="admin-input" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Capacity</label>
              <input name="capacity" type="number" required defaultValue={20} className="admin-input" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Price (USD)</label>
              <input name="price" type="number" step="0.01" required className="admin-input" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Deposit (USD)</label>
              <input name="deposit" type="number" step="0.01" required defaultValue={500} className="admin-input" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Short Description</label>
            <textarea name="shortDescription" rows={3} className="admin-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select name="status" className="admin-input">
              <option value="draft">Draft</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="booking_open">Booking Open</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <AdminButton type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create Trip"}
            </AdminButton>
            <AdminButton type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </>
  );
}
