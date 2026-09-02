import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getSiteSettings } from "@/lib/site/queries";
import { LEGAL_DRAFTS } from "@/config/legal-drafts";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "SerenEScape Travel cancellation and refund policy for group travel bookings.",
};

export default async function CancellationPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <LegalPageLayout
      title="Cancellation Policy"
      content={settings.cancellationPolicy}
      draftContent={LEGAL_DRAFTS.cancellation}
      isDraft={!settings.cancellationPolicy}
    />
  );
}
