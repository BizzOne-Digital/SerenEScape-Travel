import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/helpers";

function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return true;
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminApi();
  if (error) return error;

  if (!configureCloudinary()) {
    return jsonError("Cloudinary is not configured", 503);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "serenescape";

    if (!file) {
      return jsonError("No file provided");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "auto",
    });

    return jsonOk({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return jsonError("Upload failed", 500);
  }
}
