import { connectDB } from "@/lib/db/connect";
import { Booking } from "@/lib/models";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";
import { formatCents } from "@/lib/pricing";

export default async function AdminBookingsPage() {
  let bookings: {
    _id: string;
    bookingReference: string;
    primaryTraveler: { legalName: string; email: string };
    bookingStatus: string;
    totalCents: number;
    balanceCents: number;
    createdAt: Date;
    tripId?: { title: string };
  }[] = [];

  try {
    await connectDB();
    const raw = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("tripId", "title")
      .lean();
    bookings = raw as unknown as typeof bookings;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Bookings" description="View and manage customer bookings" />

      <AdminCard>
        {bookings.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No bookings yet</p>
        ) : (
          <AdminTable headers={["Reference", "Traveler", "Trip", "Status", "Total", "Balance", "Date"]}>
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/bookings/${b._id}`} className="font-medium text-rich-berry hover:underline">
                    {b.bookingReference}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div>{b.primaryTraveler.legalName}</div>
                  <div className="text-xs text-luxury-ink/50">{b.primaryTraveler.email}</div>
                </td>
                <td className="px-4 py-3">{(b.tripId as { title?: string })?.title ?? "—"}</td>
                <td className="px-4 py-3">
                  <AdminBadge>{b.bookingStatus.replace(/_/g, " ")}</AdminBadge>
                </td>
                <td className="px-4 py-3">{formatCents(b.totalCents)}</td>
                <td className="px-4 py-3">{formatCents(b.balanceCents)}</td>
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
