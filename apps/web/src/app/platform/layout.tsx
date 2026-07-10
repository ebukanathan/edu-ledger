"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/features/auth/hooks";

// Shell for Platform Admin pages. A real app would also guard this
// server-side (or via middleware) — see the same TODO on the dashboard
// layout. Here we redirect anonymous visitors to /login (no token, so
// useCurrentUser's query never even fires) and non-platform-admins to
// /dashboard once the current user has loaded, so nobody sits on a page
// whose form will just 401/403 on submit.
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!isLoading && user && user.role !== "platform_admin") {
      router.replace("/dashboard");
    }
  }, [token, isLoading, user, router]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="flex h-14 items-center border-b bg-card px-6">
        <span className="text-sm font-semibold tracking-tight">
          Edu<span className="text-primary">Ledger</span> Platform
        </span>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
