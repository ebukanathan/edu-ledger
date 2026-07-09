// Bootstraps the very first Platform Admin. Nobody exists yet to onboard the
// onboarder, so this is the one account created outside the normal
// platform-onboards-school-onboards-users chain.
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/generated/prisma/client';

async function main() {
  const email = process.env.PLATFORM_ADMIN_EMAIL;
  const password = process.env.PLATFORM_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Set PLATFORM_ADMIN_EMAIL and PLATFORM_ADMIN_PASSWORD to seed the platform admin');
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Platform Admin',
      email,
      password: passwordHash,
      role: Role.PLATFORM_ADMIN,
      schoolId: null,
    },
  });

  console.log(`Platform admin ready: ${email}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
