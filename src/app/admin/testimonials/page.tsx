import { connectDB } from "@/lib/db/connect";
import { Testimonial } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminBadge,
} from "@/components/admin/AdminUI";

export default async function AdminTestimonialsPage() {
  let testimonials: {
    _id: string;
    name?: string;
    location?: string;
    tripTitle?: string;
    content: string;
    rating?: number;
    approved: boolean;
    featured: boolean;
  }[] = [];

  try {
    await connectDB();
    testimonials = (await Testimonial.find().sort({ createdAt: -1 }).lean()) as unknown as typeof testimonials;
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Testimonials" description="Guest reviews and stories" />

      <AdminCard>
        {testimonials.length === 0 ? (
          <p className="p-8 text-center text-sm text-luxury-ink/50">No testimonials yet</p>
        ) : (
          <AdminTable headers={["Name", "Trip", "Rating", "Approved", "Featured", "Preview"]}>
            {testimonials.map((t) => (
              <tr key={t._id} className="hover:bg-warm-sand/10">
                <td className="px-4 py-3">{t.name ?? "Anonymous"}</td>
                <td className="px-4 py-3">{t.tripTitle ?? "—"}</td>
                <td className="px-4 py-3">{t.rating ? `${t.rating}/5` : "—"}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={t.approved ? "success" : "warning"}>
                    {t.approved ? "Yes" : "Pending"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">{t.featured ? "Yes" : "—"}</td>
                <td className="max-w-xs truncate px-4 py-3 text-luxury-ink/60">{t.content}</td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </>
  );
}
