// Data access for the users module. Owns its tables only.
// Cross-module data is fetched via the other module's public API, not its tables.
import { prisma } from '../../database';
import type { Role } from '../../generated/prisma/client';

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  schoolId: string;
}) {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: input.passwordHash,
      role: input.role,
      schoolId: input.schoolId,
    },
  });
}

export function findUsersBySchool(schoolId: string) {
  return prisma.user.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' } });
}
