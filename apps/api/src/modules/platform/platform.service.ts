// Business logic for the platform module.
// Other modules must call this through the module's public API (./index.ts),
// never reach into the repository directly.
import bcrypt from 'bcryptjs';
import * as repository from './platform.repository';
import { generateTemporaryPassword } from '../../shared/utils/password';
import { toPublicRole } from '../../shared/constants/roles';
import { ValidationError } from '../../shared/errors/app-error';
import type { OnboardSchoolInput, OnboardSchoolResult, SchoolDto } from './platform.types';

const SALT_ROUNDS = 10;

function toSchoolDto(school: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
}): SchoolDto {
  return {
    id: school.id,
    name: school.name,
    email: school.email,
    phone: school.phone,
    address: school.address,
    logoUrl: school.logoUrl,
    isActive: school.isActive,
    createdAt: school.createdAt.toISOString(),
  };
}

export async function onboardSchool(input: OnboardSchoolInput): Promise<OnboardSchoolResult> {
  const [existingSchool, existingAdmin] = await Promise.all([
    repository.findSchoolByEmail(input.school.email),
    repository.findUserByEmail(input.admin.email),
  ]);
  if (existingSchool) throw new ValidationError('A school with this email already exists');
  if (existingAdmin) throw new ValidationError('An account with this email already exists');

  const temporaryPassword = generateTemporaryPassword();
  const adminPasswordHash = await bcrypt.hash(temporaryPassword, SALT_ROUNDS);

  try {
    const { school, admin } = await repository.createSchoolWithAdmin({
      school: input.school,
      adminName: input.admin.name,
      adminEmail: input.admin.email,
      adminPasswordHash,
    });

    // No email infra yet — log server-side and return in the response so the
    // platform admin can relay it manually.
    console.log(
      `[platform] onboarded school "${school.name}" (${school.id}) — admin ${admin.email} temp password: ${temporaryPassword}`,
    );

    return {
      school: toSchoolDto(school),
      admin: { id: admin.id, name: admin.name, email: admin.email, role: toPublicRole(admin.role) },
      temporaryPassword,
    };
  } catch (err) {
    if ((err as { code?: string }).code === 'P2002') {
      throw new ValidationError('School or admin email already in use');
    }
    throw err;
  }
}
