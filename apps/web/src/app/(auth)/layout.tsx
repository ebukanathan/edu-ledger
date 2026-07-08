import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-50 via-background to-background">
      <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
        Edu<span className="text-primary">Ledger</span>
      </Link>
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
