export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="text-muted-foreground">
        Recorded fee payments. Wire up the table with{' '}
        <code>usePayments()</code> from <code>@/features/payments/hooks</code>.
      </p>
    </div>
  );
}
