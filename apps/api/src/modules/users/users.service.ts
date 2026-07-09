// Business logic for the users module.
// Other modules must call this through the module's public API (./index.ts),
// never reach into the repository directly.
import bcrypt from 'bcryptjs';
import * as repository from './users.repository';
import { Role } from '../../generated/prisma/client';
import { toPublicRole } from '../../shared/constants/roles';
import { generateTemporaryPassword } from '../../shared/utils/password';
import { ForbiddenError, ValidationError } from '../../shared/errors/app-error';
import type { Principal } from '../auth/auth.types';
import type {
  CreateSchoolUserInput,
  CreateSchoolUserResult,
  SchoolUserDto,
} from './users.types';

const SALT_ROUNDS = 10;

interface DbUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

function toDto(user: DbUser): SchoolUserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: toPublicRole(user.role),
    createdAt: user.createdAt.toISOString(),
  };
}

export async function createSchoolUser(
  principal: Principal,
  input: CreateSchoolUserInput,
): Promise<CreateSchoolUserResult> {
  if (!principal.schoolId) {
    throw new ForbiddenError('Platform admins cannot manage school users');
  }

  const existing = await repository.findUserByEmail(input.email);
  if (existing) throw new ValidationError('An account with this email already exists');

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, SALT_ROUNDS);

  const user = await repository.createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: Role[input.role],
    schoolId: principal.schoolId,
  });

  console.log(
    `[users] created ${input.role} for school ${principal.schoolId} — ${user.email} temp password: ${temporaryPassword}`,
  );

  return { user: toDto(user), temporaryPassword };
}

export async function listSchoolUsers(principal: Principal): Promise<SchoolUserDto[]> {
  if (!principal.schoolId) {
    throw new ForbiddenError('Platform admins have no school to list users for');
  }
  const users = await repository.findUsersBySchool(principal.schoolId);
  return users.map(toDto);
}
