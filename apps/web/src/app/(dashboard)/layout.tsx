'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuthStore } from '@/stores/auth-store';

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

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b bg-card px-6" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
