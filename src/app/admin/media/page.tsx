"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin/AdminUI";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useAdminToast } from "@/components/admin/AdminToast";
import type { UploadFolder } from "@/lib/uploads/constants";
import { Image as ImageIcon } from "lucide-react";

interface UploadItem {
  url: string;
  folder: string;
  filename: string;
  size: number;
  createdAt: string;
}

const FOLDERS: { value: UploadFolder; label: string }[] = [
  { value: "gallery", label: "Gallery" },
  { value: "products", label: "Products / Trips" },
  { value: "pages", label: "Pages" },
  { value: "misc", label: "Misc" },
];

export default function AdminMediaPage() {
  const [folder, setFolder] = useState<UploadFolder>("gallery");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [demoUrl, setDemoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  async function loadUploads(selectedFolder: UploadFolder) {
    setLoading(true);
    try {
      const res = await fetch(`/api/upload?folder=${selectedFolder}&limit=48`);
      const data = await res.json();
      if (res.ok) {
        setUploads(data.uploads ?? []);
      }
    } catch {
      showToast("Failed to load uploads", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUploads(folder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="Images stored in MongoDB — survives redeploys on Vercel and serverless hosts"
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="mb-4 font-display text-lg text-deep-aubergine">Upload Image</h2>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Folder</label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as UploadFolder)}
              className="admin-input"
            >
              {FOLDERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <LocalImageField
            value={demoUrl}
            onChange={(url) => {
              setDemoUrl(url);
              if (url) loadUploads(folder);
            }}
            folder={folder}
            label="New upload"
          />
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="mb-4 font-display text-lg text-deep-aubergine">How it works</h2>
          <ul className="space-y-2 text-sm text-luxury-ink/70">
            <li>Files are stored in MongoDB, not on disk.</li>
            <li>Served at <code className="rounded bg-warm-sand/50 px-1">/api/uploads/&#123;folder&#125;/&#123;filename&#125;</code></li>
            <li>Save only the returned URL on trips, pages, and settings.</li>
            <li>Replacing or removing deletes the old MongoDB document.</li>
            <li>Legacy <code className="rounded bg-warm-sand/50 px-1">/uploads/...</code> URLs show a placeholder on the frontend.</li>
          </ul>
        </AdminCard>
      </div>

      <AdminCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-deep-aubergine">
            Recent uploads — {FOLDERS.find((f) => f.value === folder)?.label}
          </h2>
          <AdminButton variant="secondary" onClick={() => loadUploads(folder)}>
            Refresh
          </AdminButton>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-luxury-ink/50">Loading…</p>
        ) : uploads.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-luxury-ink/40">
            <ImageIcon className="mb-3 h-12 w-12" />
            <p className="text-sm">No uploads in this folder yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {uploads.map((u) => (
              <div
                key={u.url}
                className="overflow-hidden rounded-lg border border-warm-sand/60"
              >
                <div className="relative aspect-video bg-luxury-ink/5">
                  <Image
                    src={u.url}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-xs text-luxury-ink/60">{u.filename}</p>
                  <p className="text-xs text-luxury-ink/40">
                    {(u.size / 1024).toFixed(1)} KB
                  </p>
                  <AdminButton
                    variant="secondary"
                    className="mt-2 w-full text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(u.url);
                      showToast("URL copied to clipboard", "success");
                    }}
                  >
                    Copy URL
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </>
  );
}
