// Data access for the auth module. Owns the User + School tables for the
// sign-up/sign-in flow. Cross-module data is fetched via other modules' APIs.
import { prisma } from '../../database';
import { Role } from '../../generated/prisma/client';

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

/** Creates a school and its first ADMIN user in one transaction. */
export async function createSchoolWithAdmin(input: {
  schoolName: string;
  email: string;
  name: string;
  passwordHash: string;
}) {
  const school = await prisma.school.create({
    data: {
      name: input.schoolName,
      email: input.email,
      users: {
        create: {
          name: input.name,
          email: input.email,
          password: input.passwordHash,
          role: Role.ADMIN,
        },
      },
    },
    include: { users: true },
  });

  return school.users[0];
}
