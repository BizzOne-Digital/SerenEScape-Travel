"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Replace, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminToast } from "@/components/admin/AdminToast";
import type { UploadFolder } from "@/lib/uploads/constants";
import { resolveImageSrc } from "@/lib/images/resolve";

interface LocalImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label?: string;
  className?: string;
  disabled?: boolean;
}

async function deleteIfStored(url: string) {
  if (!url.startsWith("/api/uploads/")) return;
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export function LocalImageField({
  value,
  onChange,
  folder,
  label = "Image",
  className,
  disabled = false,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useAdminToast();

  const previewSrc = value ? resolveImageSrc(value) : "";

  async function handleFile(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      if (value && value !== data.url) {
        await deleteIfStored(value);
      }

      onChange(data.url);
      showToast("Image uploaded successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!value) return;

    try {
      if (value.startsWith("/api/uploads/")) {
        await deleteIfStored(value);
      }
      onChange("");
      showToast("Image removed", "success");
    } catch {
      showToast("Failed to remove image", "error");
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-deep-aubergine">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <div className="overflow-hidden rounded-xl border border-warm-sand/60 bg-warm-sand/10">
          <div className="relative aspect-video w-full max-w-md bg-luxury-ink/5">
            <Image
              src={previewSrc}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={previewSrc.startsWith("/api/uploads/")}
            />
          </div>
          <div className="flex flex-wrap gap-2 p-3">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-warm-sand bg-white px-3 py-1.5 text-sm font-medium text-deep-aubergine transition hover:bg-warm-sand/30 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Replace className="h-4 w-4" />
              )}
              Replace
            </button>
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rich-berry/20 bg-rich-berry/5 px-3 py-1.5 text-sm font-medium text-rich-berry transition hover:bg-rich-berry/10 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
          <p className="truncate px-3 pb-3 text-xs text-luxury-ink/50">{value}</p>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full max-w-md flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-sand bg-warm-sand/10 py-10 transition hover:border-deep-aubergine hover:bg-warm-sand/20 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-deep-aubergine" />
          ) : (
            <ImagePlus className="mb-2 h-8 w-8 text-deep-aubergine" />
          )}
          <span className="text-sm font-medium text-deep-aubergine">
            {uploading ? "Uploading…" : "Choose image"}
          </span>
          <span className="mt-1 text-xs text-luxury-ink/50">PNG, JPEG, WebP, GIF · max 8MB</span>
        </button>
      )}
    </div>
  );
}
