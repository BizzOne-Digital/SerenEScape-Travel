import { connectDB } from "@/lib/db/connect";
import { PaymentInstallment } from "@/lib/models";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";
import { formatCents } from "@/lib/pricing";

export default async function AdminPaymentPlansPage() {
  let installments: {
    _id: string;
    label: string;
    amountCents: number;
    dueDate: Date;
    status: string;
    bookingId?: { bookingReference: string; _id: string };
  }[] = [];

  try {
    await connectDB();
    const raw = await PaymentInstallment.find()
      .sort({ dueDate: 1 })
      .populate("bookingId", "bookingReference")
      .lean();
    installments = raw as unknown as typeof installments;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Payment Plans" description="Installment schedules and due dates" />

      <AdminCard>
        {installments.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No payment plans active</p>
        ) : (
          <AdminTable headers={["Booking", "Installment", "Amount", "Due Date", "Status"]}>
            {installments.map((inst) => (
              <tr key={inst._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bookings/${(inst.bookingId as { _id?: string })?._id}`}
                    className="text-rich-berry hover:underline"
                  >
                    {(inst.bookingId as { bookingReference?: string })?.bookingReference ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3">{inst.label}</td>
                <td className="px-4 py-3">{formatCents(inst.amountCents)}</td>
                <td className="px-4 py-3">{new Date(inst.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={inst.status === "overdue" ? "danger" : inst.status === "paid" ? "success" : "default"}>
                    {inst.status}
                  </AdminBadge>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
