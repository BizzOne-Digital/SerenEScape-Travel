export function isPayPalConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET
  );
}

export function isSquareConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID &&
    process.env.SQUARE_ACCESS_TOKEN &&
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
  );
}

export function getPayPalApiBase(): string {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Failed to get PayPal access token");
  const data = await res.json();
  return data.access_token;
}

export async function createPayPalOrder(amountCents: number, currency = "USD", reference?: string) {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${getPayPalApiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: (amountCents / 100).toFixed(2),
        },
        description: reference ? `SerenEScape Travel — ${reference}` : "SerenEScape Travel Booking",
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal order creation failed: ${err}`);
  }
  return res.json();
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }
  return res.json();
}
