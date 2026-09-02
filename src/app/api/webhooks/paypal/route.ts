import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/api/helpers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const transmissionId = request.headers.get("paypal-transmission-id");
  const transmissionTime = request.headers.get("paypal-transmission-time");
  const certUrl = request.headers.get("paypal-cert-url");
  const authAlgo = request.headers.get("paypal-auth-algo");
  const transmissionSig = request.headers.get("paypal-transmission-sig");
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  // TODO: Verify webhook signature using PayPal SDK
  // See https://developer.paypal.com/api/rest/webhooks/rest/
  const verified = Boolean(
    webhookId &&
    transmissionId &&
    transmissionTime &&
    certUrl &&
    authAlgo &&
    transmissionSig
  );

  if (!verified && process.env.NODE_ENV === "production") {
    return new Response("Webhook verification failed", { status: 401 });
  }

  let event: { event_type?: string; resource?: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  console.info("[PayPal Webhook]", event.event_type, verified ? "verified" : "unverified");

  // TODO: Process payment events (PAYMENT.CAPTURE.COMPLETED, etc.)
  return jsonOk({ received: true });
}
