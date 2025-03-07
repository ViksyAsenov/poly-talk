import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { Users } from "@services/user/models";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

const FriendRequestStatusEnum = pgEnum("friend_request_status", ["PENDING", "ACCEPTED", "REJECTED"]);

const FriendRequests = pgTable("friend_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id")
    .references(() => Users.id)
    .notNull(),
  receiverId: uuid("receiver_id")
    .references(() => Users.id)
    .notNull(),
  status: FriendRequestStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

type FriendRequest = InferSelectModel<typeof FriendRequests>;
type NewFriendRequest = InferInsertModel<typeof FriendRequests>;

export { FriendRequests };

export type { FriendRequest, NewFriendRequest };
