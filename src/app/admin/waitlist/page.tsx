import { connectDB } from "@/lib/db/connect";
import { WaitlistEntry } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";

export default async function AdminWaitlistPage() {
  let entries: {
    _id: string;
    name: string;
    email: string;
    travelerCount: number;
    notified: boolean;
    createdAt: Date;
    tripId?: { title: string };
  }[] = [];

  try {
    await connectDB();
    const raw = await WaitlistEntry.find()
      .sort({ createdAt: -1 })
      .populate("tripId", "title")
      .lean();
    entries = raw as unknown as typeof entries;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Waitlist" description="Travelers waiting for trip availability" />

      <AdminCard>
        {entries.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No waitlist entries</p>
        ) : (
          <AdminTable headers={["Name", "Email", "Trip", "Travelers", "Notified", "Date"]}>
            {entries.map((e) => (
              <tr key={e._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">{e.name}</td>
                <td className="px-4 py-3">{e.email}</td>
                <td className="px-4 py-3">{(e.tripId as { title?: string })?.title ?? "—"}</td>
                <td className="px-4 py-3">{e.travelerCount}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={e.notified ? "success" : "default"}>
                    {e.notified ? "Yes" : "No"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-luxury-ink/60">
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
