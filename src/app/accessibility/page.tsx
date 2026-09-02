import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_DRAFTS } from "@/config/legal-drafts";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "SerenEScape Travel accessibility statement — our commitment to inclusive travel and web access.",
};

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      title="Accessibility Statement"
      draftContent={LEGAL_DRAFTS.accessibility}
      isDraft
    />
  );
}
