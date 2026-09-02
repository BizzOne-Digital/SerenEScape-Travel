import { connectDB } from "@/lib/db/connect";
import { Founder } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";

export default async function AdminFoundersPage() {
  let founders: {
    _id: string;
    name?: string;
    title?: string;
    order: number;
    published: boolean;
    isPlaceholder: boolean;
  }[] = [];

  try {
    await connectDB();
    founders = (await Founder.find().sort({ order: 1 }).lean()) as unknown as typeof founders;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Founders" description="Team profiles and welcome notes" />

      <AdminCard>
        {founders.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No founder profiles yet</p>
        ) : (
          <AdminTable headers={["Name", "Title", "Order", "Published", "Placeholder"]}>
            {founders.map((f) => (
              <tr key={f._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">{f.name ?? "—"}</td>
                <td className="px-4 py-3">{f.title ?? "—"}</td>
                <td className="px-4 py-3">{f.order}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={f.published ? "success" : "default"}>
                    {f.published ? "Yes" : "No"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">{f.isPlaceholder ? "Yes" : "—"}</td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
