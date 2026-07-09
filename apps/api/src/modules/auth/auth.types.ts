// Domain types for the auth module.
import type { Role } from '../../generated/prisma/client';
import type { PublicRole } from '../../shared/constants/roles';

export type { PublicRole };

/** Authenticated caller, attached to `req.principal` by the auth middleware.
 * `schoolId` is null for Platform Admins, who don't belong to a school. */
export interface Principal {
  userId: string;
  schoolId: string | null;
  role: Role;
}

/** Public user shape returned to clients (matches @eduledger/shared `User`). */
export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
  role: PublicRole;
  schoolId: string | null;
}

/** Response body for successful login. */
export interface AuthResult {
  token: string;
  user: AuthUserDto;
}

export interface LoginInput {
  email: string;
  password: string;
}
