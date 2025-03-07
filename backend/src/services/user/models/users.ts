import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { Languages } from "@services/language/models";

const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 20 }).notNull(),
  tag: varchar("tag", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  customizedFields: varchar("customized_fields", { length: 255 }).array().notNull(),
  languageId: uuid("language_id").references(() => Languages.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
});

type User = InferSelectModel<typeof Users>;
type NewUser = InferInsertModel<typeof Users>;

export { Users };

export type { User, NewUser };
