"use client";

import { AdminPageHeader, AdminBadge } from "@/components/admin/AdminUI";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default function AdminFAQsPage() {
  return (
    <>
      <AdminPageHeader
        title="FAQs"
        description="Questions shown on the FAQ page and the homepage preview. Lower order number appears first."
      />
      <CollectionManager
        name="faqs"
        singular="FAQ"
        emptyMessage="No FAQs yet"
        defaults={{ category: "general", question: "", answer: "", order: 0, published: true, isDraft: false }}
        fields={[
          { key: "category", label: "Category", type: "text", required: true, help: "e.g. booking, payments, safety, general" },
          { key: "question", label: "Question", type: "text", required: true },
          { key: "answer", label: "Answer", type: "textarea", rows: 5, required: true },
          { key: "order", label: "Order", type: "number" },
          { key: "published", label: "Published (visible on the site)", type: "checkbox" },
          { key: "isDraft", label: "Draft (hide until ready)", type: "checkbox" },
        ]}
        columns={[
          { header: "Category", render: (f) => <span className="capitalize">{String(f.category)}</span> },
          { header: "Question", render: (f) => String(f.question) },
          { header: "Order", render: (f) => String(f.order ?? 0) },
          {
            header: "Status",
            render: (f) => (
              <AdminBadge variant={f.isDraft ? "warning" : f.published ? "success" : "default"}>
                {f.isDraft ? "Draft" : f.published ? "Published" : "Hidden"}
              </AdminBadge>
            ),
          },
        ]}
      />
    </>
  );
}
