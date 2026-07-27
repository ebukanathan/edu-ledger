// Business logic for the auth module.
// Other modules must call this through the module's public API (./index.ts),
// never reach into the repository directly.
import bcrypt from 'bcryptjs';
import * as repository from './auth.repository';
import { signToken } from '../../shared/utils/jwt';
import { toPublicRole } from '../../shared/constants/roles';
import { UnauthorizedError, ValidationError } from '../../shared/errors/app-error';
import { getSchoolById } from '../platform';
import type { AuthResult, AuthUserDto, ChangePasswordInput, LoginInput } from './auth.types';
import type { Role } from '../../generated/prisma/client';

const SALT_ROUNDS = 10;

interface DbUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string | null;
}

async function toDto(user: DbUser): Promise<AuthUserDto> {
  const school = user.schoolId ? await getSchoolById(user.schoolId) : null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: toPublicRole(user.role),
    schoolId: user.schoolId,
    schoolName: school?.name ?? null,
  };
}

async function issue(user: DbUser): Promise<AuthResult> {
  const token = signToken({
    sub: user.id,
    schoolId: user.schoolId,
    role: user.role,
  });
  return { token, user: await toDto(user) };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await repository.findUserByEmail(input.email);
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw new UnauthorizedError('Invalid email or password');

  return issue(user);
}

export async function getUserById(id: string): Promise<AuthUserDto> {
  const user = await repository.findUserById(id);
  if (!user) throw new UnauthorizedError('Account no longer exists');
  return toDto(user);
}

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
  const user = await repository.findUserById(userId);
  if (!user) throw new UnauthorizedError('Account no longer exists');

  const ok = await bcrypt.compare(input.currentPassword, user.password);
  // Wrong current password is a validation failure, not an auth failure —
  // the caller is already authenticated via their bearer token.
  if (!ok) throw new ValidationError('Current password is incorrect');

  const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await repository.updatePassword(userId, passwordHash);
}
