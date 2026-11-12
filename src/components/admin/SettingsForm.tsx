"use client";

import { useState } from "react";
import { AdminButton, AdminCard } from "@/components/admin/AdminUI";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useAdminToast } from "@/components/admin/AdminToast";

export type SettingsValues = {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  facebookUrl: string;
  contactRecipientEmail: string;
  logoUrl: string;
  faviconUrl: string;
  defaultSeo: { title: string; description: string };
  privacyPolicy: string;
  bookingTerms: string;
  cancellationPolicy: string;
  accessibilityStatement: string;
  paymentPlanWording: string;
  paypalEnabled: boolean;
  squareEnabled: boolean;
  manualPaymentEnabled: boolean;
  maintenanceMode: boolean;
  analyticsId: string;
  metaPixelId: string;
};

function Text({
  label,
  value,
  onChange,
  help,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-deep-aubergine">{label}</label>
      {rows ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
      )}
      {help && <p className="mt-1 text-xs text-luxury-ink/50">{help}</p>}
    </div>
  );
}

function Toggle({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4" />
      <span>
        <span className="font-medium text-deep-aubergine">{label}</span>
        {help && <span className="block text-xs text-luxury-ink/50">{help}</span>}
      </span>
    </label>
  );
}

export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const { showToast } = useAdminToast();
  const [v, setV] = useState<SettingsValues>(initial);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to save settings");
      showToast("Settings saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <AdminCard className="space-y-4 p-6">
        <h2 className="font-display text-lg text-deep-aubergine">Business info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Business name" value={v.businessName} onChange={(x) => set("businessName", x)} />
          <Text label="Tagline" value={v.tagline} onChange={(x) => set("tagline", x)} />
          <Text label="Public email" value={v.email} onChange={(x) => set("email", x)} help="Shown in the footer and on the Contact page." />
          <Text label="Phone" value={v.phone} onChange={(x) => set("phone", x)} />
          <Text label="Facebook page URL" value={v.facebookUrl} onChange={(x) => set("facebookUrl", x)} />
          <Text
            label="Contact form recipient email"
            value={v.contactRecipientEmail}
            onChange={(x) => set("contactRecipientEmail", x)}
            help="Where messages from the contact form are sent."
          />
        </div>
      </AdminCard>

      <AdminCard className="space-y-4 p-6">
        <h2 className="font-display text-lg text-deep-aubergine">Branding</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <LocalImageField label="Logo" value={v.logoUrl} folder="pages" deferDelete onChange={(x) => set("logoUrl", x)} />
          <LocalImageField label="Favicon" value={v.faviconUrl} folder="pages" deferDelete onChange={(x) => set("faviconUrl", x)} />
        </div>
      </AdminCard>

      <AdminCard className="space-y-4 p-6">
        <h2 className="font-display text-lg text-deep-aubergine">Default search / sharing text (SEO)</h2>
        <Text
          label="Site title"
          value={v.defaultSeo.title}
          onChange={(x) => set("defaultSeo", { ...v.defaultSeo, title: x })}
          help="Used when a page has no title of its own."
        />
        <Text
          label="Site description"
          value={v.defaultSeo.description}
          onChange={(x) => set("defaultSeo", { ...v.defaultSeo, description: x })}
          rows={3}
        />
      </AdminCard>

      <AdminCard className="space-y-4 p-6">
        <h2 className="font-display text-lg text-deep-aubergine">Legal pages</h2>
        <p className="text-xs text-luxury-ink/50">
          Leave a box empty to show the built-in draft text. Separate paragraphs with a blank line.
        </p>
        <Text label="Privacy Policy" value={v.privacyPolicy} onChange={(x) => set("privacyPolicy", x)} rows={10} />
        <Text label="Terms of Service" value={v.bookingTerms} onChange={(x) => set("bookingTerms", x)} rows={10} />
        <Text label="Cancellation Policy" value={v.cancellationPolicy} onChange={(x) => set("cancellationPolicy", x)} rows={10} />
        <Text label="Accessibility Statement" value={v.accessibilityStatement} onChange={(x) => set("accessibilityStatement", x)} rows={8} />
        <Text label="Payment plan wording" value={v.paymentPlanWording} onChange={(x) => set("paymentPlanWording", x)} rows={4} />
      </AdminCard>

      <AdminCard className="space-y-4 p-6">
        <h2 className="font-display text-lg text-deep-aubergine">Payments & site status</h2>
        <Toggle label="PayPal enabled" checked={v.paypalEnabled} onChange={(x) => set("paypalEnabled", x)} />
        <Toggle label="Square enabled" checked={v.squareEnabled} onChange={(x) => set("squareEnabled", x)} />
        <Toggle label="Manual payment enabled" checked={v.manualPaymentEnabled} onChange={(x) => set("manualPaymentEnabled", x)} />
        <Toggle label="Maintenance mode" help="Flag only for now; the public site is not blocked automatically." checked={v.maintenanceMode} onChange={(x) => set("maintenanceMode", x)} />
      </AdminCard>

      <AdminCard className="space-y-4 p-6">
        <h2 className="font-display text-lg text-deep-aubergine">Tracking</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Analytics ID" value={v.analyticsId} onChange={(x) => set("analyticsId", x)} />
          <Text label="Meta Pixel ID" value={v.metaPixelId} onChange={(x) => set("metaPixelId", x)} />
        </div>
      </AdminCard>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-warm-sand/60 bg-soft-ivory/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl justify-end">
          <AdminButton onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
