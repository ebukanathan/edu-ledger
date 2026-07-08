import { Sidebar } from '@/components/layout/sidebar';

// Shell for authenticated pages. A real app would also guard this server-side
// (or via middleware) and redirect unauthenticated users to /login.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
