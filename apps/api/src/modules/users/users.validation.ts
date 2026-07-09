// Request/input validation schemas for the users module.
import { ValidationError } from '../../shared/errors/app-error';
import type { CreatableRole, CreateSchoolUserInput } from './users.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CREATABLE_ROLES: CreatableRole[] = ['FINANCE_OFFICER', 'TEACHER', 'ADMISSIONS_OFFICER'];

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseCreateSchoolUser(body: unknown): CreateSchoolUserInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = asString(b.name);
  const email = asString(b.email).toLowerCase();
  const role = asString(b.role) as CreatableRole;

  if (name.length < 2) throw new ValidationError('Name is required');
  if (!EMAIL_RE.test(email)) throw new ValidationError('Enter a valid email');
  if (!CREATABLE_ROLES.includes(role)) {
    throw new ValidationError(`Role must be one of: ${CREATABLE_ROLES.join(', ')}`);
  }

  return { name, email, role };
}
