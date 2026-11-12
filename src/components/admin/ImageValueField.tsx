"use client";

import { LocalImageField } from "@/components/admin/LocalImageField";
import type { UploadFolder } from "@/lib/uploads/constants";

export type ImageValue = { url: string; alt: string };

interface ImageValueFieldProps {
  label: string;
  value: ImageValue | undefined | null;
  onChange: (value: ImageValue) => void;
  folder?: UploadFolder;
  help?: string;
}

/** Picture upload + alt text, stored as { url, alt }. Old files are cleaned up on Save (server-side). */
export function ImageValueField({ label, value, onChange, folder = "pages", help }: ImageValueFieldProps) {
  const current: ImageValue = { url: value?.url ?? "", alt: value?.alt ?? "" };

  return (
    <div className="space-y-2">
      <LocalImageField
        label={label}
        value={current.url}
        folder={folder}
        deferDelete
        onChange={(url) => onChange({ ...current, url })}
      />
      {help && <p className="text-xs text-luxury-ink/50">{help}</p>}
      {current.url && (
        <div className="max-w-md">
          <label className="mb-1 block text-xs font-medium text-luxury-ink/70">
            Picture description (alt text, for accessibility and SEO)
          </label>
          <input
            value={current.alt}
            onChange={(e) => onChange({ ...current, alt: e.target.value })}
            placeholder="Describe what the picture shows"
            className="admin-input"
          />
        </div>
      )}
    </div>
  );
}
