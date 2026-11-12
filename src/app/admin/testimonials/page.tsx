"use client";

import { AdminPageHeader, AdminBadge } from "@/components/admin/AdminUI";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default function AdminTestimonialsPage() {
  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Guest stories. Only approved testimonials appear on the site; featured ones are shown first."
      />
      <CollectionManager
        name="testimonials"
        singular="Testimonial"
        emptyMessage="No testimonials yet"
        defaults={{
          name: "",
          location: "",
          tripTitle: "",
          content: "",
          rating: 5,
          image: { url: "", alt: "" },
          approved: true,
          featured: false,
        }}
        fields={[
          { key: "name", label: "Guest name", type: "text" },
          { key: "location", label: "Location", type: "text" },
          { key: "tripTitle", label: "Trip", type: "text" },
          { key: "content", label: "Testimonial", type: "textarea", rows: 5, required: true },
          { key: "rating", label: "Rating (1-5)", type: "number" },
          { key: "image", label: "Photo (optional)", type: "image" },
          { key: "approved", label: "Approved (visible on the site)", type: "checkbox" },
          { key: "featured", label: "Featured (shown first)", type: "checkbox" },
        ]}
        columns={[
          { header: "Name", render: (t) => String(t.name || "Anonymous") },
          { header: "Trip", render: (t) => String(t.tripTitle || "—") },
          { header: "Rating", render: (t) => (t.rating ? `${t.rating}/5` : "—") },
          {
            header: "Approved",
            render: (t) => <AdminBadge variant={t.approved ? "success" : "warning"}>{t.approved ? "Yes" : "Pending"}</AdminBadge>,
          },
          { header: "Featured", render: (t) => (t.featured ? "Yes" : "—") },
          {
            header: "Preview",
            render: (t) => <span className="line-clamp-2 max-w-xs text-luxury-ink/60">{String(t.content)}</span>,
          },
        ]}
      />
    </>
  );
}
