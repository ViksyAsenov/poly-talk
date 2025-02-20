import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Conversations } from './conversations';
import { Users } from '@services/user/models';
import { Languages } from '@services/language/models';

const Messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .references(() => Conversations.id)
    .notNull(),
  senderId: uuid('sender_id')
    .references(() => Users.id)
    .notNull(),
  content: text('content').notNull(),
  originalLanguageId: uuid('original_language_id')
    .references(() => Languages.id)
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

const MessageTranslations = pgTable('message_translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id')
    .references(() => Messages.id)
    .notNull(),
  targetLanguageId: uuid('target_language_id')
    .references(() => Languages.id)
    .notNull(),
  translatedContent: text('translated_content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export { Messages, MessageTranslations };
