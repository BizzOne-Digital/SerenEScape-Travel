import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getPageSchema } from "@/lib/content/schema";
import { isContentPageKey } from "@/lib/content/defaults";
import { loadPageContent } from "@/lib/content/get";

export default async function AdminContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const schema = getPageSchema(page);
  if (!schema || !isContentPageKey(page)) notFound();

  const content = await loadPageContent(page);

  return (
    <>
      <AdminPageHeader
        title={schema.title}
        description={schema.description}
        action={
          <Link href="/admin/content" className="text-sm font-medium text-rich-berry hover:underline">
            All pages
          </Link>
        }
      />
      <ContentEditor schema={schema} initial={JSON.parse(JSON.stringify(content))} />
    </>
  );
}
