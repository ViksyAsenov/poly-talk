import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { Conversations } from "./conversations";
import { Users } from "@services/user/models";
import { Languages } from "@services/language/models";
import { InferSelectModel } from "drizzle-orm";

const Messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .references(() => Conversations.id)
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => Users.id)
    .notNull(),
  content: text("content").notNull(),
  originalLanguageId: uuid("original_language_id").references(() => Languages.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const MessageTranslations = pgTable("message_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id")
    .references(() => Messages.id)
    .notNull(),
  targetLanguageId: uuid("target_language_id")
    .references(() => Languages.id)
    .notNull(),
  translatedContent: text("translated_content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Message = InferSelectModel<typeof Messages>;

export { Messages, MessageTranslations };
