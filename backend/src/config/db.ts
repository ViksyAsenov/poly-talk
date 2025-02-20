import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import schema from '@schema';
import config from '@config/env';

const dbUrl = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${String(config.db.port)}/${
  config.db.name
}`;

const client = postgres(dbUrl);

const db = drizzle(client, { schema, logger: false });

export { dbUrl, db };
