import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export async function requireAdminOrThrow() {
  const session = await requireAdmin();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
