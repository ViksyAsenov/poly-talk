import { pgTable, varchar, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { InferInsertModel } from "drizzle-orm";

const Languages = pgTable("languages", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 2 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nativeSpeakers: integer("native_speakers").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

type NewLanguage = InferInsertModel<typeof Languages>;

export { Languages };
export type { NewLanguage };
