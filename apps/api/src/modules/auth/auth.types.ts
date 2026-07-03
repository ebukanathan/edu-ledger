// Domain types for the auth module.
import type { Role } from '../../generated/prisma/client';

// Mirror of @eduledger/shared `UserRole`. Duplicated rather than imported
// because the api tsconfig's `rootDir: src` excludes packages/*; keep the
// string literals in sync with the shared contract.
export type PublicRole = 'admin' | 'bursar' | 'staff';

/** Authenticated caller, attached to `req.principal` by the auth middleware. */
export interface Principal {
  userId: string;
  schoolId: string;
  role: Role;
}

/** Public user shape returned to clients (matches @eduledger/shared `User`). */
export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
  role: PublicRole;
}

/** Response body for successful login/registration. */
export interface AuthResult {
  token: string;
  user: AuthUserDto;
}

/** Sign-up creates a school together with its first ADMIN user. */
export interface RegisterInput {
  schoolName: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
