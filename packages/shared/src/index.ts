// @eduledger/shared — the contract layer between apps/api and apps/web.
//
// Put ONLY things both sides must agree on here: domain enums, DTO shapes,
// and API response envelopes. No runtime logic, no framework imports — so it
// stays safe to import from both a Node backend and a browser bundle.

export type UserRole = 'admin' | 'bursar' | 'staff';

export type PaymentStatus = 'pending' | 'recorded' | 'reconciled' | 'failed';

/** Standard envelope the backend wraps successful responses in. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Standard pagination envelope. */
export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  reference: string;
  status: PaymentStatus;
  paidAt: string;
}
