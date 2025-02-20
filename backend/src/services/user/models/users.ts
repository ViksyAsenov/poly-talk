import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { Languages } from '@services/language/models';

const UserRoleEnum = pgEnum('user_role', ['USER', 'ADMINISTRATOR']);

const EUserRole = z.enum(UserRoleEnum.enumValues);

type TUserRole = keyof typeof EUserRole.enum;

const Users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: varchar('google_id', { length: 255 }).notNull().unique(),
  avatar: varchar('avatar', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isPrivate: boolean('is_private').notNull().default(false),
  role: UserRoleEnum('role').notNull().default('USER'),
  languageId: uuid('language_id').references(() => Languages.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
});

type User = InferSelectModel<typeof Users>;
type NewUser = InferInsertModel<typeof Users>;

export { Users, UserRoleEnum, EUserRole };

export type { User, NewUser, TUserRole };
