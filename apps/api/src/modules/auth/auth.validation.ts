// Request/input validation for the auth module. Kept dependency-free (no zod
// on the backend) — each parser returns a typed, trimmed input or throws.
import { ValidationError } from '../../shared/errors/app-error';
import type { LoginInput, RegisterInput } from './auth.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseRegister(body: unknown): RegisterInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const schoolName = asString(b.schoolName);
  const name = asString(b.name);
  const email = asString(b.email).toLowerCase();
  const password = typeof b.password === 'string' ? b.password : '';

  if (schoolName.length < 2) throw new ValidationError('School name is required');
  if (name.length < 2) throw new ValidationError('Name is required');
  if (!EMAIL_RE.test(email)) throw new ValidationError('Enter a valid email');
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }

  return { schoolName, name, email, password };
}

export function parseLogin(body: unknown): LoginInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const email = asString(b.email).toLowerCase();
  const password = typeof b.password === 'string' ? b.password : '';

  if (!EMAIL_RE.test(email)) throw new ValidationError('Enter a valid email');
  if (!password) throw new ValidationError('Password is required');

  return { email, password };
}
