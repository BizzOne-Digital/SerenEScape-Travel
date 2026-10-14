/**
 * Verifies PayPal Live credentials: OAuth + create checkout order (no capture / no charge).
 * Run: npm run test:paypal
 */
import {
  createPayPalOrder,
  getPayPalAccessToken,
  getPayPalApiBase,
  isPayPalConfigured,
} from "../lib/payments/paypal";

async function main() {
  console.log("PayPal API base:", getPayPalApiBase());
  console.log("Configured:", isPayPalConfigured());

  if (!isPayPalConfigured()) {
    console.error("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
    process.exit(1);
  }

  const token = await getPayPalAccessToken();
  console.log("Access token: OK (length", token.length, ")");

  const order = await createPayPalOrder(100, "USD", "LOCAL-CONFIG-TEST");
  console.log("Order created:", {
    id: order.id,
    status: order.status,
    intent: order.intent,
  });

  console.log("\nPayPal setup check passed (order not captured — no payment taken).");
}

main().catch((err) => {
  console.error("PayPal test failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
