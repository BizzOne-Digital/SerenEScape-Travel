import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getSiteSettings } from "@/lib/site/queries";
import { LEGAL_DRAFTS } from "@/config/legal-drafts";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SerenEScape Travel terms of service and booking conditions.",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <LegalPageLayout
      title="Terms of Service"
      content={settings.bookingTerms}
      draftContent={LEGAL_DRAFTS.terms}
      isDraft={!settings.bookingTerms}
    />
  );
}
