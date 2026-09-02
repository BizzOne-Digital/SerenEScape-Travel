import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";
import { formatCents } from "@/lib/pricing";

export default async function AdminPaymentsPage() {
  let payments: {
    _id: string;
    provider: string;
    amountCents: number;
    status: string;
    type: string;
    paidAt?: Date;
    createdAt: Date;
    bookingId?: { bookingReference: string };
  }[] = [];

  try {
    await connectDB();
    const raw = await Payment.find()
      .sort({ createdAt: -1 })
      .populate("bookingId", "bookingReference")
      .lean();
    payments = raw as unknown as typeof payments;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Payments" description="Transaction history across all bookings" />

      <AdminCard>
        {payments.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No payments recorded</p>
        ) : (
          <AdminTable headers={["Booking", "Provider", "Type", "Amount", "Status", "Date"]}>
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">
                  {(p.bookingId as { bookingReference?: string })?.bookingReference ?? "—"}
                </td>
                <td className="px-4 py-3 capitalize">{p.provider}</td>
                <td className="px-4 py-3 capitalize">{p.type}</td>
                <td className="px-4 py-3">{formatCents(p.amountCents)}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={p.status === "completed" ? "success" : "warning"}>
                    {p.status}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-luxury-ink/60">
                  {new Date(p.paidAt ?? p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
