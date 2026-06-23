// Re-export the shared API contract (@eduledger/shared) so app code can import
// everything domain-related from `@/types`. Add web-only UI types below.

export type {
  ApiResponse,
  Paginated,
  UserRole,
  PaymentStatus,
  User,
  Payment,
} from '@eduledger/shared';
