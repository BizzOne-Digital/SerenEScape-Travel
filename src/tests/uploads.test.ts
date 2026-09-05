import { describe, it, expect } from "vitest";
import {
  parseStoredUploadUrl,
  buildStoredUploadUrl,
  sanitizeFilename,
  isUploadFolder,
} from "@/lib/uploads/constants";
import { generateUploadFilename, deleteStoredUploadByUrl } from "@/lib/uploads/storage";
import { resolveImageSrc, isLegacyDiskUploadUrl } from "@/lib/images/resolve";

describe("upload storage helpers", () => {
  it("validates upload folders", () => {
    expect(isUploadFolder("gallery")).toBe(true);
    expect(isUploadFolder("invalid")).toBe(false);
  });

  it("sanitizes filenames", () => {
    expect(sanitizeFilename("1700000000-abc123.jpg")).toBe(true);
    expect(sanitizeFilename("../etc/passwd")).toBe(false);
    expect(sanitizeFilename("file/name.jpg")).toBe(false);
  });

  it("parses stored upload URLs", () => {
    const parsed = parseStoredUploadUrl("/api/uploads/gallery/1700000000-abc123.jpg");
    expect(parsed).toEqual({ folder: "gallery", filename: "1700000000-abc123.jpg" });
    expect(parseStoredUploadUrl("/uploads/old.jpg")).toBeNull();
  });

  it("builds stored upload URLs", () => {
    expect(buildStoredUploadUrl("pages", "test.png")).toBe("/api/uploads/pages/test.png");
  });

  it("generates unique filenames", () => {
    const a = generateUploadFilename("image/png");
    const b = generateUploadFilename("image/png");
    expect(a).toMatch(/\.png$/);
    expect(a).not.toBe(b);
  });
});

describe("image resolve helpers", () => {
  it("falls back for legacy disk URLs", () => {
    expect(isLegacyDiskUploadUrl("/uploads/hero.jpg")).toBe(true);
    expect(isLegacyDiskUploadUrl("/api/uploads/gallery/x.jpg")).toBe(false);
    expect(resolveImageSrc("/uploads/hero.jpg")).toBe("/images/founders-duo.jpg");
  });

  it("keeps stored upload URLs", () => {
    expect(resolveImageSrc("/api/uploads/gallery/test.jpg")).toBe("/api/uploads/gallery/test.jpg");
  });
});
