// Data access for the auth module. Owns the User table for the sign-in flow.
// Cross-module data is fetched via other modules' APIs.
import { prisma } from '../../database';

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
