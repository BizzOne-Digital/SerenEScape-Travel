import { SquareClient, SquareEnvironment, WebhooksHelper } from "square";
import { randomUUID } from "crypto";

let squareClient: SquareClient | null = null;

export function getSquareClient(): SquareClient | null {
  if (!process.env.SQUARE_ACCESS_TOKEN) return null;
  if (!squareClient) {
    squareClient = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment:
        process.env.SQUARE_ENV === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return squareClient;
}

export function isSquareReady(): boolean {
  return Boolean(
    process.env.SQUARE_ACCESS_TOKEN &&
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
  );
}

export async function createSquarePayment(params: {
  sourceId: string;
  amountCents: number;
  currency?: string;
  idempotencyKey?: string;
  reference?: string;
}) {
  const client = getSquareClient();
  if (!client) throw new Error("Square is not configured");

  const response = await client.payments.create({
    sourceId: params.sourceId,
    idempotencyKey: params.idempotencyKey ?? randomUUID(),
    amountMoney: {
      amount: BigInt(params.amountCents),
      currency: (params.currency ?? "USD") as "USD",
    },
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
    note: params.reference ? `SerenEScape — ${params.reference}` : undefined,
  });

  return response;
}

export async function verifySquareWebhookSignature(
  body: string,
  signature: string,
  url: string
): Promise<boolean> {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key) return false;

  try {
    return await WebhooksHelper.verifySignature({
      requestBody: body,
      signatureHeader: signature,
      signatureKey: key,
      notificationUrl: url,
    });
  } catch {
    return false;
  }
}
