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
  /**
   * When true, replacing/removing does NOT delete the old file immediately.
   * Use inside forms that have a Save button: the API route removes files that
   * are no longer referenced once the save succeeds.
   */
  deferDelete?: boolean;
}

/** Vercel rejects request bodies above ~4.5MB, so big photos are shrunk in the browser first. */
const SAFE_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 2400;

async function prepareForUpload(file: File): Promise<File> {
  if (file.size <= SAFE_UPLOAD_BYTES || file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    for (const quality of [0.88, 0.8, 0.7, 0.6]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", quality)
      );
      if (blob && blob.size <= SAFE_UPLOAD_BYTES) {
        return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
      }
    }
  } catch {
    // fall through and upload the original; the server will validate it
  }
  return file;
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
  deferDelete = false,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useAdminToast();

  const previewSrc = value ? resolveImageSrc(value) : "";

  async function handleFile(file: File) {
    setUploading(true);

    try {
      const prepared = await prepareForUpload(file);
      const formData = new FormData();
      formData.append("file", prepared);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 413 ? "Image is too large for the server. Try a smaller photo." : (data.error ?? "Upload failed")
        );
      }

      if (!deferDelete && value && value !== data.url) {
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
      if (!deferDelete && value.startsWith("/api/uploads/")) {
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
