// Payment domain types live in the shared contract package; re-export here so
// the feature's own modules import from a single local path.
export type { Payment, PaymentStatus } from '@eduledger/shared';
