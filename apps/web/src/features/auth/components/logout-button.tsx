"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "../hooks";

export function LogoutButton() {
  const token = useAuthStore((s) => s.token);
  const logout = useLogout();

  if (!token) return null;

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
    >
      {logout.isPending ? "Signing out…" : "Log out"}
    </button>
  );
}
