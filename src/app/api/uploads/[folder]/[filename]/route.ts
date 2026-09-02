import { NextRequest, NextResponse } from "next/server";
import { getStoredUpload, isUploadFolder, sanitizeFilename } from "@/lib/uploads/storage";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!isUploadFolder(folder) || !sanitizeFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const doc = await getStoredUpload(folder, filename);
    if (!doc || !doc.data) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buffer = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data);
    const body = new Uint8Array(buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }
}
