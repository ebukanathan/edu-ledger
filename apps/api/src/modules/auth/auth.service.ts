// Business logic for the auth module.
// Other modules must call this through the module's public API (./index.ts),
// never reach into the repository directly.
import bcrypt from 'bcryptjs';
import * as repository from './auth.repository';
import { signToken } from '../../shared/utils/jwt';
import { toPublicRole } from '../../shared/constants/roles';
import { UnauthorizedError } from '../../shared/errors/app-error';
import type { AuthResult, AuthUserDto, LoginInput } from './auth.types';
import type { Role } from '../../generated/prisma/client';

interface DbUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string | null;
}

function toDto(user: DbUser): AuthUserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: toPublicRole(user.role),
    schoolId: user.schoolId,
  };
}

function issue(user: DbUser): AuthResult {
  const token = signToken({
    sub: user.id,
    schoolId: user.schoolId,
    role: user.role,
  });
  return { token, user: toDto(user) };
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
