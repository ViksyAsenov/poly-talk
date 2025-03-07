import { db } from "@config/db";
import { GoogleUser } from "@services/auth/types";
import { AppError } from "@common/error/appError";
import { FriendRequests, Friends, NewUser, Users } from "@services/user/models";
import { eq, and, or } from "drizzle-orm";
import { UserErrors } from "./constants/errors";
import { IMinUser } from "./types/user";
import { getLanguageById } from "@services/language";
import { GenericErrors } from "@common/constants/error";

const generateUserTag = async (username: string) => {
  let tag;

  do {
    tag = `${username.toLowerCase()}#${String(Math.floor(1000 + Math.random() * 9000))}`;
  } while ((await db.select().from(Users).where(eq(Users.tag, tag))).length > 0);

  return tag;
};

const getUserById = async (userId: string) => {
  const user = (await db.select().from(Users).where(eq(Users.id, userId)))[0];

  if (!user) {
    throw new AppError(UserErrors.NOT_FOUND);
  }

  return user;
};

const getMinUserById = async (userId: string): Promise<IMinUser> => {
  const user = (await db.select().from(Users).where(eq(Users.id, userId)))[0];

  if (!user) {
    throw new AppError(UserErrors.NOT_FOUND);
  }

  const language = await getLanguageById(user.languageId ?? "", false);

  return {
    id: user.id,
    avatar: user.avatar,
    displayName: user.displayName,
    email: user.email,
    tag: user.tag,
    firstName: user.firstName,
    lastName: user.lastName,
    languageId: user.languageId,
    languageName: language?.name,
  };
};

const getOrCreateUserWithGoogle = async (profile: GoogleUser) => {
  const foundUser = (await db.select().from(Users).where(eq(Users.googleId, profile.id)))[0];

  if (!foundUser) {
    const tag = await generateUserTag(profile.name);

    const createdUser = (
      await db
        .insert(Users)
        .values({
          tag,
          googleId: profile.id,
          avatar: profile.picture,
          email: profile.email,
          displayName: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          customizedFields: [],
        })
        .returning()
    )[0];

    if (!createdUser) {
      throw new AppError(GenericErrors.UNEXPECTED_ERROR, {
        profile,
      });
    }

    return await getUserById(createdUser.id);
  }

  const updateObject: Partial<NewUser> = {
    googleId: profile.id,
    email: profile.email,
  };

  const customizedFields = foundUser.customizedFields || [];

  if (!customizedFields.includes("avatar")) {
    updateObject.avatar = profile.picture;
  }

  if (!customizedFields.includes("displayName")) {
    updateObject.displayName = profile.name;
  }

  if (!customizedFields.includes("firstName")) {
    updateObject.firstName = profile.given_name;
  }

  if (!customizedFields.includes("lastName")) {
    updateObject.lastName = profile.family_name;
  }

  await db.update(Users).set(updateObject).where(eq(Users.id, foundUser.id));

  return await getUserById(foundUser.id);
};

const updateUserProfile = async (userId: string, profileData: Partial<NewUser>) => {
  const foundUser = (await db.select().from(Users).where(eq(Users.id, userId)))[0];

  if (!foundUser) {
    throw new AppError(UserErrors.NOT_FOUND);
  }

  const customizedFields = [...foundUser.customizedFields];

  Object.keys(profileData).forEach((field) => {
    if (!customizedFields.includes(field)) {
      customizedFields.push(field);
    }
  });

  await db
    .update(Users)
    .set({
      ...profileData,
      customizedFields,
    })
    .where(eq(Users.id, userId));

  return await getMinUserById(userId);
};

const getUserByTag = async (userTag: string): Promise<IMinUser> => {
  const [username, tag] = userTag.split("#");

  if (!username || !tag) {
    throw new AppError(UserErrors.INVALID_TAG);
  }

  const user = (
    await db
      .select()
      .from(Users)
      .where(and(eq(Users.tag, tag)))
  )[0];

  if (!user) {
    throw new AppError(UserErrors.NOT_FOUND);
  }

  return getMinUserById(user.id);
};

const sendFriendRequest = async (userId: string, receiverTag: string) => {
  const receiver = await getUserByTag(receiverTag);

  if (userId === receiver.id) {
    throw new AppError(UserErrors.CANNOT_FRIEND_SELF);
  }

  const existingFriendship = (
    await db
      .select()
      .from(Friends)
      .where(
        or(
          and(eq(Friends.userId, userId), eq(Friends.friendId, receiver.id)),
          and(eq(Friends.friendId, receiver.id), eq(Friends.userId, userId)),
        ),
      )
  )[0];

  if (existingFriendship) {
    throw new AppError(UserErrors.ALREADY_FRIENDS);
  }

  const existingRequest = (
    await db
      .select()
      .from(FriendRequests)
      .where(
        and(
          eq(FriendRequests.senderId, userId),
          eq(FriendRequests.receiverId, receiver.id),
          eq(FriendRequests.status, "PENDING"),
        ),
      )
  )[0];

  if (existingRequest) {
    throw new AppError(UserErrors.REQUEST_ALREADY_SENT);
  }

  const pendingIncomingRequest = (
    await db
      .select()
      .from(FriendRequests)
      .where(
        and(
          eq(FriendRequests.senderId, receiver.id),
          eq(FriendRequests.receiverId, userId),
          eq(FriendRequests.status, "PENDING"),
        ),
      )
  )[0];

  if (pendingIncomingRequest) {
    return await acceptFriendRequest(userId, pendingIncomingRequest.id);
  }

  const request = (
    await db
      .insert(FriendRequests)
      .values({
        senderId: userId,
        receiverId: receiver.id,
        status: "PENDING",
      })
      .returning()
  )[0];

  if (!request) {
    throw new AppError(GenericErrors.UNEXPECTED_ERROR, { request });
  }

  return request;
};

const getFriendRequests = async (userId: string) => {
  const sentRequests = await db
    .select()
    .from(FriendRequests)
    .where(and(eq(FriendRequests.senderId, userId), eq(FriendRequests.status, "PENDING")));

  const receivedRequests = await db
    .select()
    .from(FriendRequests)
    .where(and(eq(FriendRequests.receiverId, userId), eq(FriendRequests.status, "PENDING")));

  const sentRequestsWithDetails = await Promise.all(
    sentRequests.map(async (request) => {
      const receiver = await getMinUserById(request.receiverId);
      return {
        id: request.id,
        receiver,
        createdAt: request.createdAt,
      };
    }),
  );

  const receivedRequestsWithDetails = await Promise.all(
    receivedRequests.map(async (request) => {
      const sender = await getMinUserById(request.senderId);
      return {
        id: request.id,
        sender,
        createdAt: request.createdAt,
      };
    }),
  );

  return {
    sent: sentRequestsWithDetails,
    received: receivedRequestsWithDetails,
  };
};

const acceptFriendRequest = async (userId: string, requestId: string) => {
  const request = (
    await db
      .select()
      .from(FriendRequests)
      .where(and(eq(FriendRequests.receiverId, userId), eq(FriendRequests.id, requestId)))
  )[0];

  if (!request) {
    throw new AppError(UserErrors.REQUEST_NOT_FOUND);
  }

  if (request.status !== "PENDING") {
    throw new AppError(UserErrors.REQUEST_ALREADY_PROCESSED);
  }

  await db.update(FriendRequests).set({ status: "ACCEPTED" }).where(eq(FriendRequests.id, requestId));

  const friendship = (
    await db
      .insert(Friends)
      .values({
        userId: request.receiverId,
        friendId: request.senderId,
      })
      .returning()
  )[0];

  return friendship;
};

const rejectFriendRequest = async (userId: string, requestId: string) => {
  const request = (
    await db
      .select()
      .from(FriendRequests)
      .where(and(eq(FriendRequests.receiverId, userId), eq(FriendRequests.id, requestId)))
  )[0];

  if (!request) {
    throw new AppError(UserErrors.REQUEST_NOT_FOUND);
  }

  if (request.status !== "PENDING") {
    throw new AppError(UserErrors.REQUEST_ALREADY_PROCESSED);
  }

  await db.update(FriendRequests).set({ status: "REJECTED" }).where(eq(FriendRequests.id, requestId));

  return true;
};

const getFriends = async (userId: string) => {
  const friendships = await db
    .select()
    .from(Friends)
    .where(or(eq(Friends.userId, userId), eq(Friends.friendId, userId)));

  const friendIds = friendships
    .filter((friendship) => friendship.friendId !== userId)
    .map((friendship) => friendship.friendId);

  const friends = await Promise.all(friendIds.map((friendId) => getMinUserById(friendId ?? "")));

  return friends;
};

const removeFriend = async (userId: string, friendId: string) => {
  const friendship = (
    await db
      .select()
      .from(Friends)
      .where(
        or(
          and(eq(Friends.userId, userId), eq(Friends.friendId, friendId)),
          and(eq(Friends.friendId, userId), eq(Friends.userId, friendId)),
        ),
      )
  )[0];

  if (!friendship) {
    throw new AppError(UserErrors.NOT_FRIENDS);
  }

  await db
    .delete(Friends)
    .where(
      or(
        and((eq(Friends.userId, userId), eq(Friends.friendId, friendId))),
        and(eq(Friends.friendId, userId), eq(Friends.userId, friendId)),
      ),
    );

  return true;
};

const areFriends = async (userId: string, friendId: string): Promise<boolean> => {
  const friendship = (
    await db
      .select()
      .from(Friends)
      .where(
        or(
          and((eq(Friends.userId, userId), eq(Friends.friendId, friendId))),
          and(eq(Friends.friendId, userId), eq(Friends.userId, friendId)),
        ),
      )
  )[0];

  return Boolean(friendship);
};

export {
  getMinUserById,
  getOrCreateUserWithGoogle,
  updateUserProfile,
  getUserByTag,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
  areFriends,
};
