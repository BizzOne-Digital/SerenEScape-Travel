import { connectDB } from "@/lib/db/connect";
import { ContactInquiry, CustomGroupInquiry } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";

export default async function AdminInquiriesPage() {
  let contacts: { _id: string; name: string; email: string; subject: string; status: string; createdAt: Date }[] = [];
  let customGroups: { _id: string; organizationName: string; contactName: string; email: string; createdAt: Date }[] = [];

  try {
    await connectDB();
    [contacts, customGroups] = await Promise.all([
      ContactInquiry.find({ subject: { $ne: "newsletter" } }).sort({ createdAt: -1 }).limit(50).lean(),
      CustomGroupInquiry.find().sort({ createdAt: -1 }).limit(50).lean(),
    ]) as unknown as [typeof contacts, typeof customGroups];
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Inquiries" description="Contact forms and custom group requests" />

      <div className="space-y-8">
        <AdminCard>
          <div className="border-b border-warm-sand/60 px-5 py-4">
            <h2 className="font-display text-lg text-deep-aubergine">Contact Inquiries</h2>
          </div>
          {contacts.length === 0 ? (
            <p className="p-8 text-center text-sm text-luxury-ink/50">No contact inquiries</p>
          ) : (
            <AdminTable headers={["Name", "Email", "Subject", "Status", "Date"]}>
              {contacts.map((c) => (
                <tr key={c._id} className="hover:bg-warm-sand/10">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3 capitalize">{c.subject.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <AdminBadge variant={c.status === "new" ? "warning" : "default"}>{c.status}</AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-luxury-ink/60">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>

        <AdminCard>
          <div className="border-b border-warm-sand/60 px-5 py-4">
            <h2 className="font-display text-lg text-deep-aubergine">Custom Group Inquiries</h2>
          </div>
          {customGroups.length === 0 ? (
            <p className="p-8 text-center text-sm text-luxury-ink/50">No custom group inquiries</p>
          ) : (
            <AdminTable headers={["Organization", "Contact", "Email", "Date"]}>
              {customGroups.map((g) => (
                <tr key={g._id} className="hover:bg-warm-sand/10">
                  <td className="px-4 py-3">{g.organizationName}</td>
                  <td className="px-4 py-3">{g.contactName}</td>
                  <td className="px-4 py-3">{g.email}</td>
                  <td className="px-4 py-3 text-luxury-ink/60">
                    {new Date(g.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      </div>
    </>
  );
}
