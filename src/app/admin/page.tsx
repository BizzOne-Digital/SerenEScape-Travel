"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader, StatCard, AdminCard, AdminTable, AdminBadge } from "@/components/admin/AdminUI";
import { formatCents } from "@/lib/pricing";

interface DashboardData {
  stats: {
    trips: number;
    bookings: number;
    revenue: number;
    pendingInquiries: number;
    waitlist: number;
    activePromos: number;
  };
  recentBookings: {
    _id: string;
    bookingReference: string;
    primaryTraveler: { legalName: string };
    bookingStatus: string;
    totalCents: number;
    createdAt: string;
    tripId?: { title: string };
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-luxury-ink/50">Loading dashboard…</div>;
  }

  const stats = data?.stats;

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your travel business"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Published Trips" value={stats?.trips ?? 0} />
        <StatCard label="Total Bookings" value={stats?.bookings ?? 0} />
        <StatCard label="Revenue" value={formatCents(stats?.revenue ?? 0)} />
        <StatCard label="Pending Inquiries" value={stats?.pendingInquiries ?? 0} />
        <StatCard label="Waitlist" value={stats?.waitlist ?? 0} />
        <StatCard label="Active Promos" value={stats?.activePromos ?? 0} />
      </div>

      <AdminCard>
        <div className="border-b border-warm-sand/60 px-5 py-4">
          <h2 className="font-display text-lg text-deep-aubergine">Recent Bookings</h2>
        </div>
        {!data?.recentBookings?.length ? (
          <p className="px-5 py-8 text-center text-sm text-luxury-ink/50">No bookings yet</p>
        ) : (
          <AdminTable headers={["Reference", "Traveler", "Trip", "Status", "Total", "Date"]}>
            {data.recentBookings.map((b) => (
              <tr key={b._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/bookings/${b._id}`} className="font-medium text-rich-berry hover:underline">
                    {b.bookingReference}
                  </Link>
                </td>
                <td className="px-4 py-3">{b.primaryTraveler.legalName}</td>
                <td className="px-4 py-3">{b.tripId?.title ?? "—"}</td>
                <td className="px-4 py-3">
                  <AdminBadge>{b.bookingStatus.replace(/_/g, " ")}</AdminBadge>
                </td>
                <td className="px-4 py-3">{formatCents(b.totalCents)}</td>
                <td className="px-4 py-3 text-luxury-ink/60">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
