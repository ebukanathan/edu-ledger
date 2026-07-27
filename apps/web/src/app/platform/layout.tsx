// Shell for Platform Admin pages. Unlike the dashboard layout, this is
// intentionally unguarded: /platform/schools/new is a public self-service
// school registration page (linked straight from the homepage, no login
// required), not a platform-admin-only screen.
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
