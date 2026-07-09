// @eduledger/shared — the contract layer between apps/api and apps/web.
//
// Put ONLY things both sides must agree on here: domain enums, DTO shapes,
// and API response envelopes. No runtime logic, no framework imports — so it
// stays safe to import from both a Node backend and a browser bundle.

export type UserRole =
  | 'platform_admin'
  | 'school_admin'
  | 'finance_officer'
  | 'teacher'
  | 'admissions_officer';

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
  schoolId: string | null;
}

export interface School {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

/** Roles a School Admin is allowed to create for their own school. */
export type CreatableSchoolRole = Exclude<UserRole, 'platform_admin' | 'school_admin'>;

export interface OnboardSchoolPayload {
  school: { name: string; email: string; phone?: string; address?: string; logoUrl?: string };
  admin: { name: string; email: string };
}

export interface OnboardSchoolResponse {
  school: School;
  admin: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  temporaryPassword: string;
}

export interface CreateSchoolUserPayload {
  name: string;
  email: string;
  role: CreatableSchoolRole;
}

export interface CreateSchoolUserResponse {
  user: User;
  temporaryPassword: string;
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
