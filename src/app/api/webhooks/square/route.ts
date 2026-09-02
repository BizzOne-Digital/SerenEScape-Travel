import { NextRequest } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db/connect";
import { verifySquareWebhookSignature } from "@/lib/payments/square";
import { jsonOk } from "@/lib/api/helpers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature") ?? "";
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/webhooks/square`;

  const verified = await verifySquareWebhookSignature(body, signature, url);

  if (!verified && process.env.NODE_ENV === "production") {
    return new Response("Webhook verification failed", { status: 401 });
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  if (isDBConfigured()) {
    try {
      await connectDB();
      // TODO: Process payment.updated events and update Payment/Booking records
      console.info("[Square Webhook]", event.type, verified ? "verified" : "unverified");
    } catch (err) {
      console.error("Square webhook processing error:", err);
    }
  }

  return jsonOk({ received: true });
}
