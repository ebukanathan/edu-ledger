// Request/input validation for the platform module. Hand-rolled (no zod on
// the backend), matching the style of auth.validation.ts.
import { ValidationError } from '../../shared/errors/app-error';
import type { OnboardSchoolInput } from './platform.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptionalString(value: unknown): string | undefined {
  const s = asString(value);
  return s.length > 0 ? s : undefined;
}

export function parseOnboardSchool(body: unknown): OnboardSchoolInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const schoolBody = (b.school ?? {}) as Record<string, unknown>;
  const adminBody = (b.admin ?? {}) as Record<string, unknown>;

  const schoolName = asString(schoolBody.name);
  const schoolEmail = asString(schoolBody.email).toLowerCase();
  const adminName = asString(adminBody.name);
  const adminEmail = asString(adminBody.email).toLowerCase();

  if (schoolName.length < 2) throw new ValidationError('School name is required');
  if (!EMAIL_RE.test(schoolEmail)) throw new ValidationError('Enter a valid school email');
  if (adminName.length < 2) throw new ValidationError('School admin name is required');
  if (!EMAIL_RE.test(adminEmail)) throw new ValidationError('Enter a valid school admin email');
  if (adminEmail === schoolEmail) {
    throw new ValidationError('School admin email must differ from the school email');
  }

  return {
    school: {
      name: schoolName,
      email: schoolEmail,
      phone: asOptionalString(schoolBody.phone),
      address: asOptionalString(schoolBody.address),
      logoUrl: asOptionalString(schoolBody.logoUrl),
    },
    admin: { name: adminName, email: adminEmail },
  };
}
