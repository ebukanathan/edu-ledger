import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-background to-background">
      <div className="container flex flex-col items-center gap-6 text-center">
        <span className="rounded-full bg-accent px-4 py-1 text-xs font-medium text-accent-foreground">
          Fees, reconciled
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Edu<span className="text-primary">Ledger</span>
        </h1>
        <p className="max-w-md text-muted-foreground">
          A fees reconciliation platform for schools — record payments, match
          them against ledgers, and resolve discrepancies.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
