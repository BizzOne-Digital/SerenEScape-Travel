import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { ContactInquiry } from "@/lib/models";
import { jsonError, jsonOk } from "@/lib/api/helpers";

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Please enter a valid email address");
    }

    if (!isDBConfigured()) {
      return jsonError("Service unavailable", 503);
    }

    await connectDB();

    const existing = await ContactInquiry.findOne({
      email: parsed.data.email.toLowerCase(),
      subject: "newsletter",
    });

    if (existing) {
      return jsonOk({ message: "You're already on the list!" });
    }

    await ContactInquiry.create({
      name: parsed.data.name ?? "Newsletter Subscriber",
      email: parsed.data.email.toLowerCase(),
      subject: "newsletter",
      message: "Newsletter subscription via website footer",
      status: "new",
    });

    return jsonOk({ message: "Welcome to the journey — you're on the list." }, 201);
  } catch {
    return jsonError("Failed to subscribe", 500);
  }
}
