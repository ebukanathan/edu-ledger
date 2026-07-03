import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config';
import { PrismaClient } from '../generated/prisma/client';

// Single Prisma client shared by all module repositories. Prisma 7 talks to
// Postgres through a driver adapter (pg) rather than a bundled query engine.
const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma = new PrismaClient({ adapter });
