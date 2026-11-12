import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getSiteSettings } from "@/lib/site/queries";
import { LEGAL_DRAFTS } from "@/config/legal-drafts";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Our accessibility statement and commitment to inclusive travel and web access.",
};

export default async function AccessibilityPage() {
  const settings = await getSiteSettings();

  return (
    <LegalPageLayout
      title="Accessibility Statement"
      content={settings.accessibilityStatement}
      draftContent={LEGAL_DRAFTS.accessibility}
      isDraft={!settings.accessibilityStatement}
    />
  );
}
