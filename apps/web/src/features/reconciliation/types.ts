export type ReconciliationStatus = 'matched' | 'unmatched' | 'disputed';

export interface ReconciliationEntry {
  id: string;
  paymentId: string | null;
  ledgerRef: string;
  amount: number;
  status: ReconciliationStatus;
  resolvedAt: string | null;
}
