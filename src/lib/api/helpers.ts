import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function requireAdminApi() {
  const session = await requireAdmin();
  if (!session) {
    return { session: null as null, error: jsonError("Unauthorized", 401) };
  }
  return { session, error: null };
}
