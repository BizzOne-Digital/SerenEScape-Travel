"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminToastProvider } from "@/components/admin/AdminToast";

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-soft-ivory via-warm-sand/30 to-soft-ivory">
        <AdminSidebar />
        <main className="lg:pl-64">
          <div className="px-4 py-8 pt-16 lg:px-8 lg:pt-8">{children}</div>
        </main>
      </div>
    </AdminToastProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
