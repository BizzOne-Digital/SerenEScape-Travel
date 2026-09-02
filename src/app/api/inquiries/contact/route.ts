import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { ContactInquiry } from "@/lib/models";
import { contactSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    if (!isDBConfigured()) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please email us directly." },
        { status: 503 }
      );
    }

    await connectDB();
    await ContactInquiry.create(parsed.data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
