import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { Users } from "@services/user/models";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

const Friends = pgTable(
  "friends",
  {
    userId: uuid("user_id").references(() => Users.id),
    friendId: uuid("friend_id").references(() => Users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.friendId] })],
);

type Friend = InferSelectModel<typeof Friends>;
type NewFriend = InferInsertModel<typeof Friends>;

export type { Friend, NewFriend };

export { Friends };
