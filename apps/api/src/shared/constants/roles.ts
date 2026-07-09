// Single source of truth for DB Role -> public role string mapping.
// Duplicated (rather than imported) against @eduledger/shared's `UserRole`
// because the api tsconfig's `rootDir: src` excludes packages/*; keep the
// string literals in sync with the shared contract.
import { Role } from '../../generated/prisma/client';

export type PublicRole =
  | 'platform_admin'
  | 'school_admin'
  | 'finance_officer'
  | 'teacher'
  | 'admissions_officer';

export const ROLE_TO_PUBLIC: Record<Role, PublicRole> = {
  [Role.PLATFORM_ADMIN]: 'platform_admin',
  [Role.SCHOOL_ADMIN]: 'school_admin',
  [Role.FINANCE_OFFICER]: 'finance_officer',
  [Role.TEACHER]: 'teacher',
  [Role.ADMISSIONS_OFFICER]: 'admissions_officer',
};

export function toPublicRole(role: Role): PublicRole {
  return ROLE_TO_PUBLIC[role];
}
