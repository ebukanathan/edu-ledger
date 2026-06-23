import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">EduLedger</h1>
      <p className="max-w-md text-muted-foreground">
        A fees reconciliation platform for schools — record payments, match them
        against ledgers, and resolve discrepancies.
      </p>
      <Link
        href="/login"
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Sign in
      </Link>
    </main>
  );
}
