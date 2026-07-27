import type { UserRole } from '@/types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId: string | null;
  schoolName: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
