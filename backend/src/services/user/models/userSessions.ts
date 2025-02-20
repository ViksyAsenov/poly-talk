import { json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel } from 'drizzle-orm';

const UserSessions = pgTable('user_sessions', {
  sid: varchar('sid').primaryKey().notNull(),
  sess: json('sess').notNull(),
  expire: timestamp('expire', {
    withTimezone: false,
    precision: 6,
  }).notNull(),
});

export type NewUserSession = InferInsertModel<typeof UserSessions>;

export { UserSessions };
