import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { SiteSettings } from "@/lib/models";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { SettingsForm, type SettingsValues } from "@/components/admin/SettingsForm";
import { BRAND } from "@/config/brand";
import { IMAGES } from "@/config/images";

export default async function AdminSettingsPage() {
  let settings: Record<string, unknown> | null = null;
  let dbError = false;

  if (isDBConfigured()) {
    try {
      await connectDB();
      settings = (await SiteSettings.findOne().lean()) as Record<string, unknown> | null;
    } catch {
      dbError = true;
    }
  } else {
    dbError = true;
  }

  const s: Record<string, unknown> = settings ?? {};
  const str = (key: keyof SettingsValues, fallback = "") => (typeof s[key] === "string" ? (s[key] as string) : fallback);
  const bool = (key: keyof SettingsValues, fallback: boolean) => (typeof s[key] === "boolean" ? (s[key] as boolean) : fallback);
  const seo = (s.defaultSeo ?? {}) as { title?: string; description?: string };

  const initial: SettingsValues = {
    businessName: str("businessName", BRAND.name),
    tagline: str("tagline", BRAND.tagline),
    email: str("email", BRAND.email),
    phone: str("phone", BRAND.phone),
    facebookUrl: str("facebookUrl", BRAND.facebookUrl),
    contactRecipientEmail: str("contactRecipientEmail", BRAND.email),
    logoUrl: str("logoUrl", IMAGES.logo.src),
    faviconUrl: str("faviconUrl", IMAGES.logo.src),
    defaultSeo: { title: seo.title ?? "", description: seo.description ?? "" },
    privacyPolicy: str("privacyPolicy"),
    bookingTerms: str("bookingTerms"),
    cancellationPolicy: str("cancellationPolicy"),
    accessibilityStatement: str("accessibilityStatement"),
    paymentPlanWording: str("paymentPlanWording"),
    paypalEnabled: bool("paypalEnabled", true),
    squareEnabled: bool("squareEnabled", true),
    manualPaymentEnabled: bool("manualPaymentEnabled", false),
    maintenanceMode: bool("maintenanceMode", false),
    analyticsId: str("analyticsId"),
    metaPixelId: str("metaPixelId"),
  };

  return (
    <>
      <AdminPageHeader title="Settings" description="Contact details, logo, legal pages and payment options" />
      {dbError && (
        <div className="mb-6 rounded-lg bg-burnt-orange/10 px-4 py-3 text-sm text-burnt-orange">
          Could not reach the database. Values below are the defaults; saving will fail until MONGODB_URI is working.
        </div>
      )}
      <SettingsForm initial={initial} />
    </>
  );
}
