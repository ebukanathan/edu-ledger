"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks";

// Shell for Platform Admin pages. A real app would also guard this
// server-side (or via middleware) — see the same TODO on the dashboard
// layout. Here we just redirect non-platform-admins once the current user
// has loaded, so a school user landing here doesn't sit on a 403'ing page.
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user && user.role !== "platform_admin") {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

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
