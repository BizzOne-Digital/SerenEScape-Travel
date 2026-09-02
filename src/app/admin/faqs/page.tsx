import { connectDB } from "@/lib/db/connect";
import { FAQ } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";

export default async function AdminFAQsPage() {
  let faqs: {
    _id: string;
    category: string;
    question: string;
    answer: string;
    order: number;
    published: boolean;
    isDraft: boolean;
  }[] = [];

  try {
    await connectDB();
    faqs = (await FAQ.find().sort({ category: 1, order: 1 }).lean()) as unknown as typeof faqs;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="FAQs" description="Frequently asked questions" />

      <AdminCard>
        {faqs.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No FAQs yet</p>
        ) : (
          <AdminTable headers={["Category", "Question", "Order", "Status"]}>
            {faqs.map((f) => (
              <tr key={f._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3 capitalize">{f.category}</td>
                <td className="px-4 py-3">{f.question}</td>
                <td className="px-4 py-3">{f.order}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={f.isDraft ? "warning" : f.published ? "success" : "default"}>
                    {f.isDraft ? "Draft" : f.published ? "Published" : "Hidden"}
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
