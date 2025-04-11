import { Languages } from "@services/language/models";
import { Users } from "@services/user/models";
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const Conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  isGroup: boolean("is_group").notNull().default(false),
  createdBy: uuid("created_by").references(() => Users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

const ConversationParticipants = pgTable("conversation_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => Users.id)
    .notNull(),
  conversationId: uuid("conversation_id")
    .references(() => Conversations.id)
    .notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export { Conversations, ConversationParticipants };
