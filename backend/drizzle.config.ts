import { defineConfig } from 'drizzle-kit';
import config from '@config/env';

export default defineConfig({
  schema: './src/services/**/models/*.ts',
  out: './.drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: config.db.host,
    port: config.db.port,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,
    ssl: false,
  },
  verbose: true,
  strict: true,
});
