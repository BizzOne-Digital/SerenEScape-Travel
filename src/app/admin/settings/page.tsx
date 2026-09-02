import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/lib/models";
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
} from "@/components/admin/AdminUI";

export default async function AdminSettingsPage() {
  let settings = null;

  try {
    await connectDB();
    settings = await SiteSettings.findOne().lean();
  } catch {
    // DB not configured
  }

  return (
    <>
      <AdminPageHeader title="Settings" description="Site configuration and payment options" />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="mb-4 font-display text-lg text-deep-aubergine">Business Info</h2>
          {settings ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-luxury-ink/60">Business Name</dt>
                <dd>{settings.businessName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-luxury-ink/60">Email</dt>
                <dd>{settings.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-luxury-ink/60">Phone</dt>
                <dd>{settings.phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-luxury-ink/60">Tagline</dt>
                <dd>{settings.tagline}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-luxury-ink/50">Run seed script to initialize settings</p>
          )}
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="mb-4 font-display text-lg text-deep-aubergine">Payment Providers</h2>
          {settings ? (
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-luxury-ink/60">PayPal</dt>
                <AdminBadge variant={settings.paypalEnabled ? "success" : "default"}>
                  {settings.paypalEnabled ? "Enabled" : "Disabled"}
                </AdminBadge>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-luxury-ink/60">Square</dt>
                <AdminBadge variant={settings.squareEnabled ? "success" : "default"}>
                  {settings.squareEnabled ? "Enabled" : "Disabled"}
                </AdminBadge>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-luxury-ink/60">Manual Payment</dt>
                <AdminBadge variant={settings.manualPaymentEnabled ? "success" : "default"}>
                  {settings.manualPaymentEnabled ? "Enabled" : "Disabled"}
                </AdminBadge>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-luxury-ink/60">Maintenance Mode</dt>
                <AdminBadge variant={settings.maintenanceMode ? "danger" : "success"}>
                  {settings.maintenanceMode ? "On" : "Off"}
                </AdminBadge>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-luxury-ink/50">No settings found</p>
          )}
        </AdminCard>
      </div>
    </>
  );
}
