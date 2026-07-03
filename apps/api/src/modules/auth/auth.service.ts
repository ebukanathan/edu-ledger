// Business logic for the auth module.
// Other modules must call this through the module's public API (./index.ts),
// never reach into the repository directly.
import bcrypt from 'bcryptjs';
import * as repository from './auth.repository';
import { signToken } from '../../shared/utils/jwt';
import {
  UnauthorizedError,
  ValidationError,
} from '../../shared/errors/app-error';
import { Role } from '../../generated/prisma/client';
import type {
  AuthResult,
  AuthUserDto,
  LoginInput,
  PublicRole,
  RegisterInput,
} from './auth.types';

const SALT_ROUNDS = 10;

// DB roles → the public role vocabulary shared with the web app.
const ROLE_TO_PUBLIC: Record<Role, PublicRole> = {
  [Role.ADMIN]: 'admin',
  [Role.ACCOUNTANT]: 'bursar',
};

interface DbUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string;
}

function toDto(user: DbUser): AuthUserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: ROLE_TO_PUBLIC[user.role],
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

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await repository.findUserByEmail(input.email);
  if (existing) {
    throw new ValidationError('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  try {
    const user = await repository.createSchoolWithAdmin({
      schoolName: input.schoolName,
      email: input.email,
      name: input.name,
      passwordHash,
    });
    return issue(user);
  } catch (err) {
    // Unique-constraint race (email taken between the check and the insert).
    if ((err as { code?: string }).code === 'P2002') {
      throw new ValidationError('An account with this email already exists');
    }
    throw err;
  }
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
