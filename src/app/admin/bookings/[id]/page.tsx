import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Booking, Payment, Trip } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminButton,
} from "@/components/admin/AdminUI";
import { formatCents } from "@/lib/pricing";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let booking = null;
  let trip = null;
  let payments: { amountCents: number; provider: string; status: string; paidAt?: Date }[] = [];

  try {
    await connectDB();
    booking = await Booking.findById(id).lean();
    if (booking) {
      trip = await Trip.findById(booking.tripId).select("title slug destination").lean();
      payments = await Payment.find({ bookingId: id }).sort({ createdAt: -1 }).lean();
    }
  } catch {
    // DB not configured
  }

  if (!booking) notFound();

  return (
    <>
      <AdminPageHeader
        title={booking.bookingReference}
        description={`Booked ${new Date(booking.createdAt).toLocaleDateString()}`}
        action={
          <Link href="/admin/bookings">
            <AdminButton variant="secondary">Back to Bookings</AdminButton>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="mb-4 font-display text-lg text-deep-aubergine">Traveler</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Name</dt>
              <dd>{booking.primaryTraveler.legalName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Email</dt>
              <dd>{booking.primaryTraveler.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Phone</dt>
              <dd>{booking.primaryTraveler.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Travelers</dt>
              <dd>{booking.travelerCount}</dd>
            </div>
          </dl>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="mb-4 font-display text-lg text-deep-aubergine">Payment</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Status</dt>
              <dd><AdminBadge>{booking.bookingStatus.replace(/_/g, " ")}</AdminBadge></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Total</dt>
              <dd>{formatCents(booking.totalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Paid</dt>
              <dd>{formatCents(booking.amountPaidCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Balance</dt>
              <dd className="font-medium">{formatCents(booking.balanceCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-luxury-ink/60">Choice</dt>
              <dd>{booking.paymentChoice.replace(/_/g, " ")}</dd>
            </div>
          </dl>
        </AdminCard>

        {trip && (
          <AdminCard className="p-6">
            <h2 className="mb-4 font-display text-lg text-deep-aubergine">Trip</h2>
            <p className="font-medium">{trip.title}</p>
            <p className="text-sm text-luxury-ink/60">{trip.destination}</p>
          </AdminCard>
        )}

        <AdminCard className="p-6">
          <h2 className="mb-4 font-display text-lg text-deep-aubergine">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-sm text-luxury-ink/50">No payments recorded</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {payments.map((p, i) => (
                <li key={i} className="flex justify-between border-b border-warm-sand/40 pb-2">
                  <span>{p.provider} — {p.status}</span>
                  <span>{formatCents(p.amountCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </>
  );
}
