'use client';

import { useCurrentUser } from '@/features/auth/hooks';
import { LogoutButton } from '@/features/auth/components/logout-button';

// Shell for Platform Admin pages. Unlike the dashboard layout, this is
// intentionally unguarded: /platform/schools/new is a public self-service
// school registration page (linked straight from the homepage, no login
// required), not a platform-admin-only screen. The user name / logout
// button hide themselves when nobody's signed in.
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="flex h-14 items-center justify-between border-b bg-card px-6">
        <span className="text-sm font-semibold tracking-tight">
          Edu<span className="text-primary">Ledger</span> Platform
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">{user?.name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
