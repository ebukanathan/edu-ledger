import { env } from '../config';

// Single connection/pool shared by all module repositories.
// Wire your client (Prisma/Knex/pg) here.
export const db = {
  url: env.databaseUrl,
  // client: new Pool({ connectionString: env.databaseUrl }),
};
