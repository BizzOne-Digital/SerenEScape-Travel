"use client";

import { AdminPageHeader, AdminBadge } from "@/components/admin/AdminUI";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default function AdminFoundersPage() {
  return (
    <>
      <AdminPageHeader
        title="Founders"
        description="Team profiles shown on the homepage and About page. Turn off 'Placeholder' and turn on 'Published' to show a profile."
      />
      <CollectionManager
        name="founders"
        singular="Founder"
        emptyMessage="No founder profiles yet"
        defaults={{
          name: "",
          title: "",
          bio: "",
          welcomeNote: "",
          image: { url: "", alt: "" },
          order: 0,
          published: true,
          isPlaceholder: false,
        }}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "title", label: "Title / role", type: "text" },
          { key: "image", label: "Photo", type: "image" },
          { key: "bio", label: "Biography", type: "textarea", rows: 5 },
          { key: "welcomeNote", label: "Welcome note (short quote)", type: "textarea", rows: 3 },
          { key: "order", label: "Order", type: "number" },
          { key: "published", label: "Published (visible on the site)", type: "checkbox" },
          { key: "isPlaceholder", label: "Placeholder (shows the 'content pending' card instead)", type: "checkbox" },
        ]}
        columns={[
          { header: "Name", render: (f) => String(f.name ?? "—") },
          { header: "Title", render: (f) => String(f.title ?? "—") },
          { header: "Order", render: (f) => String(f.order ?? 0) },
          {
            header: "Published",
            render: (f) => <AdminBadge variant={f.published ? "success" : "default"}>{f.published ? "Yes" : "No"}</AdminBadge>,
          },
          { header: "Placeholder", render: (f) => (f.isPlaceholder ? "Yes" : "—") },
        ]}
      />
    </>
  );
}
