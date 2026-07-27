'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuthStore } from '@/stores/auth-store';
import { useCurrentUser } from '@/features/auth/hooks';
import { LogoutButton } from '@/features/auth/components/logout-button';

// Shell for authenticated pages. A real app would also guard this
// server-side (or via middleware); here we redirect anonymous visitors to
// /login client-side, so a form under this layout doesn't sit there and
// 401 on submit instead of sending the user to sign in first.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-6">
          <span className="text-sm font-semibold text-foreground">
            {user?.schoolName}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
