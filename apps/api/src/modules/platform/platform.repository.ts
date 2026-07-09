// Data access for the platform module. Owns the School-onboarding write path,
// which spans both School and User — the only place those two tables are
// created together, always inside one transaction.
import { prisma } from '../../database';
import { Role } from '../../generated/prisma/client';

export function findSchoolByEmail(email: string) {
  return prisma.school.findUnique({ where: { email } });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createSchoolWithAdmin(input: {
  school: { name: string; email: string; phone?: string; address?: string; logoUrl?: string };
  adminName: string;
  adminEmail: string;
  adminPasswordHash: string;
}) {
  return prisma.$transaction(async (tx) => {
    const school = await tx.school.create({ data: input.school });
    const admin = await tx.user.create({
      data: {
        name: input.adminName,
        email: input.adminEmail,
        password: input.adminPasswordHash,
        role: Role.SCHOOL_ADMIN,
        schoolId: school.id,
      },
    });
    return { school, admin };
  });
}
