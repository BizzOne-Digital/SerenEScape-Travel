import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import { CONTENT_SCHEMAS } from "@/lib/content/schema";

export default function AdminContentIndexPage() {
  return (
    <>
      <AdminPageHeader
        title="Site Content"
        description="Edit the text, buttons and pictures of every page. Changes go live as soon as you save."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {CONTENT_SCHEMAS.map((page) => (
          <Link key={page.key} href={`/admin/content/${page.key}`} className="group">
            <AdminCard className="flex h-full items-start gap-4 p-5 transition-shadow group-hover:shadow-md">
              <div className="rounded-lg bg-deep-aubergine/5 p-2.5 text-deep-aubergine">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg text-deep-aubergine">{page.title}</h2>
                <p className="mt-1 text-sm text-luxury-ink/60">{page.description}</p>
                <p className="mt-2 text-xs text-luxury-ink/40">{page.sections.length} sections</p>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 text-luxury-ink/30 group-hover:text-deep-aubergine" />
            </AdminCard>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-luxury-ink/60">
        Trips, FAQs, Founders and Testimonials have their own sections in the sidebar. Email, phone, logo and legal
        pages are in Settings.
      </p>
    </>
  );
}
