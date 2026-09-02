import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getSiteSettings } from "@/lib/site/queries";
import { LEGAL_DRAFTS } from "@/config/legal-drafts";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SerenEScape Travel privacy policy — how we collect, use, and protect your information.",
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <LegalPageLayout
      title="Privacy Policy"
      content={settings.privacyPolicy}
      draftContent={LEGAL_DRAFTS.privacy}
      isDraft={!settings.privacyPolicy}
    />
  );
}
