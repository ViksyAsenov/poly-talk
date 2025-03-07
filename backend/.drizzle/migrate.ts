import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { dbUrl } from "@config/db";

const migrationClient = postgres(dbUrl, { max: 1 });

const init = async () => {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: ".drizzle/migrations",
  });

  await migrationClient.end();
};

void init();
