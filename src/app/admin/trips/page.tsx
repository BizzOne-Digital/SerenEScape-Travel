"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminButton,
  EmptyState,
} from "@/components/admin/AdminUI";
import { formatCents } from "@/lib/pricing";

interface Trip {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  status: string;
  priceFromCents: number;
  startDate?: string;
  reservedCount: number;
  capacity: number;
}

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trips")
      .then((r) => r.json())
      .then((d) => setTrips(d.trips ?? []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Trips"
        description="Manage destinations and itineraries"
        action={
          <Link href="/admin/trips/new">
            <AdminButton>Add Trip</AdminButton>
          </Link>
        }
      />

      <AdminCard>
        {loading ? (
          <p className="p-8 text-center text-luxury-ink/50">Loading trips…</p>
        ) : trips.length === 0 ? (
          <EmptyState message="No trips found. Create your first trip." />
        ) : (
          <AdminTable headers={["Title", "Destination", "Status", "Price", "Capacity", "Start Date", ""]}>
            {trips.map((trip) => (
              <tr key={trip._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3 font-medium">{trip.title}</td>
                <td className="px-4 py-3">{trip.destination}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={trip.status === "booking_open" ? "success" : "default"}>
                    {trip.status.replace(/_/g, " ")}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">{formatCents(trip.priceFromCents)}</td>
                <td className="px-4 py-3">
                  {trip.reservedCount}/{trip.capacity}
                </td>
                <td className="px-4 py-3 text-luxury-ink/60">
                  {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/trips/${trip._id}/edit`} className="text-sm text-rich-berry hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
