import { db } from "@config/db";
import { eq, and, desc, sql, lte } from "drizzle-orm";

import { getMinUserById, areFriends } from "@services/user";
import { getLanguageById, translateMessage } from "@services/language";
import { ConversationParticipants, Conversations, Message, Messages, MessageTranslations } from "@services/chat/models";
import { ChatErrors } from "@services/chat/constants";
import { AppError } from "@common/error/appError";
import logger from "@config/logger";
import { GenericErrors } from "@common/constants/error";
import { MessageData, ParticipantData, ConversationData } from "@services/chat/types";
import { emitToUser } from "@services/socket";

const getConversationById = async (conversationId: string) => {
  const conversation = (await db.select().from(Conversations).where(eq(Conversations.id, conversationId)))[0];

  if (!conversation) {
    throw new AppError(ChatErrors.NOT_FOUND);
  }

  return conversation;
};

const getConversationParticipants = async (conversationId: string): Promise<ParticipantData[]> => {
  const participants = await db
    .select()
    .from(ConversationParticipants)
    .where(eq(ConversationParticipants.conversationId, conversationId));

  const participantsWithDetails = await Promise.all(
    participants.map(async (participant) => {
      const user = await getMinUserById(participant.userId);

      return {
        id: participant.id,
        user,
        conversationId: participant.conversationId,
        isAdmin: participant.isAdmin,
        updatedAt: participant.updatedAt,
        createdAt: participant.createdAt,
      };
    }),
  );

  return participantsWithDetails;
};

const isParticipant = async (userId: string, conversationId: string) => {
  const participant = (
    await db
      .select()
      .from(ConversationParticipants)
      .where(
        and(eq(ConversationParticipants.userId, userId), eq(ConversationParticipants.conversationId, conversationId)),
      )
  )[0];

  return Boolean(participant);
};

const createDirectConversation = async (userId: string, otherUserId: string) => {
  const friendship = await areFriends(userId, otherUserId);

  if (!friendship) {
    throw new AppError(ChatErrors.NOT_FRIENDS);
  }

  if (userId === otherUserId) {
    throw new AppError(ChatErrors.CANNOT_MESSAGE_SELF);
  }

  const existingConversations = await getUserConversations(userId);

  for (const conversations of existingConversations) {
    const participants = await db
      .select()
      .from(ConversationParticipants)
      .where(eq(ConversationParticipants.conversationId, conversations.id));
    if (!conversations.isGroup && participants.length === 2) {
      const otherParticipant = participants.find((participant) => participant.userId !== userId);

      if (otherParticipant && otherParticipant.userId === otherUserId) {
        return await getConversationDetails(userId, conversations.id);
      }
    }
  }

  const user = await getMinUserById(userId);
  const otherUser = await getMinUserById(otherUserId);

  const conversation = (
    await db
      .insert(Conversations)
      .values({
        isGroup: false,
        name: null,
      })
      .returning()
  )[0];

  if (!conversation) {
    throw new AppError(GenericErrors.UNEXPECTED_ERROR, { conversation });
  }

  await db.insert(ConversationParticipants).values([
    {
      userId: user.id,
      conversationId: conversation.id,
      isAdmin: false,
    },
    {
      userId: otherUser.id,
      conversationId: conversation.id,
      isAdmin: false,
    },
  ]);

  return await getConversationDetails(userId, conversation.id);
};

const hasDuplicateIds = (participantIds: string[]) => {
  const idSet = new Set<string>();

  for (const participantId of participantIds) {
    if (idSet.has(participantId)) {
      return true;
    }

    idSet.add(participantId);
  }

  return false;
};

const createGroupConversation = async (userId: string, name: string, participantIds: string[]) => {
  if (hasDuplicateIds(participantIds)) {
    throw new AppError(ChatErrors.DUPLICATE_PARTICIPANTS);
  }

  if (participantIds.includes(userId)) {
    throw new AppError(ChatErrors.CANNOT_MESSAGE_SELF);
  }

  if (participantIds.length < 2) {
    throw new AppError(ChatErrors.INVALID_GROUP_DATA);
  }

  const user = await getMinUserById(userId);

  const conversation = (
    await db
      .insert(Conversations)
      .values({
        name,
        isGroup: true,
        createdBy: user.id,
      })
      .returning()
  )[0];

  if (!conversation) {
    throw new AppError(GenericErrors.UNEXPECTED_ERROR, { conversation });
  }

  await db.insert(ConversationParticipants).values({
    userId: user.id,
    conversationId: conversation.id,
    isAdmin: true,
  });

  for (const participantId of participantIds) {
    if (participantId !== userId) {
      const participant = await getMinUserById(participantId);

      if (!areFriends(userId, participantId)) {
        throw new AppError(ChatErrors.NOT_FRIENDS);
      }

      await db.insert(ConversationParticipants).values({
        userId: participant.id,
        conversationId: conversation.id,
        isAdmin: false,
      });
    }
  }

  return await getConversationDetails(userId, conversation.id);
};

const getConversationDetails = async (userId: string, conversationId: string): Promise<ConversationData> => {
  const isUserParticipant = await isParticipant(userId, conversationId);

  if (!isUserParticipant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  const user = await getMinUserById(userId);

  const conversation = await getConversationById(conversationId);

  const participants = await getConversationParticipants(conversationId);

  const latestMessage = (
    await db
      .select()
      .from(Messages)
      .where(eq(Messages.conversationId, conversation.id))
      .orderBy(desc(Messages.createdAt))
      .limit(1)
  )[0];

  let previewMessage = null;
  if (latestMessage) {
    if (!user.languageId) {
      previewMessage = latestMessage.content;
    } else {
      const translation = await getMessageTranslation(userId, latestMessage, user.languageId);

      previewMessage = translation.isTranslated ? translation.content : latestMessage.content;
    }
  }

  return {
    ...conversation,
    participants,
    lastActivity: latestMessage?.createdAt || conversation.createdAt,
    preview: previewMessage,
  };
};

const getUserConversations = async (userId: string): Promise<ConversationData[]> => {
  const user = await getMinUserById(userId);

  const participants = await db
    .select()
    .from(ConversationParticipants)
    .where(eq(ConversationParticipants.userId, userId));

  const conversations = await Promise.all(
    participants.map(async (participation) => {
      const conversation = await getConversationById(participation.conversationId);

      const latestMessage = (
        await db
          .select()
          .from(Messages)
          .where(eq(Messages.conversationId, conversation.id))
          .orderBy(desc(Messages.createdAt))
          .limit(1)
      )[0];

      let previewMessage = null;
      if (latestMessage) {
        if (!user.languageId) {
          previewMessage = latestMessage.content;
        } else {
          const translation = await getMessageTranslation(userId, latestMessage, user.languageId);

          previewMessage = translation.isTranslated ? translation.content : latestMessage.content;
        }
      }

      return {
        ...conversation,
        preview: previewMessage,
        lastActivity: latestMessage?.createdAt || conversation.createdAt,
      };
    }),
  );

  conversations.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

  const conversationWithParticipants: ConversationData[] = [];
  for (const conversation of conversations) {
    const participants = await getConversationParticipants(conversation.id);
    conversationWithParticipants.push({ ...conversation, participants });
  }

  return conversationWithParticipants;
};

const sendMessage = async (userId: string, conversationId: string, content: string): Promise<MessageData> => {
  const user = await getMinUserById(userId);
  const isUserParticipant = await isParticipant(user.id, conversationId);

  if (!isUserParticipant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  const participants = await getConversationParticipants(conversationId);

  const conversation = await getConversationById(conversationId);
  if (!conversation.isGroup) {
    const otherParticipant = participants.find((participant) => participant.user.id !== userId);

    if (otherParticipant && !(await areFriends(userId, otherParticipant.user.id))) {
      throw new AppError(ChatErrors.NOT_FRIENDS);
    }
  }

  const message = (
    await db
      .insert(Messages)
      .values({
        conversationId,
        senderId: user.id,
        content,
      })
      .returning()
  )[0];

  if (!message) {
    throw new AppError(GenericErrors.UNEXPECTED_ERROR, { message });
  }

  for (const participant of participants) {
    const participantData = await getMinUserById(participant.user.id);

    const messageData: MessageData = {
      id: message.id,
      sender: user,
      displayContent: content,
      content,
      isTranslated: false,
      conversationId: message.conversationId,
      createdAt: message.createdAt,
    };

    if (participantData.languageId && message.senderId !== participantData.id) {
      const translation = await getMessageTranslation(participantData.id, message, participantData.languageId);

      messageData.displayContent = translation.content;
      messageData.isTranslated = translation.isTranslated;
    }

    emitToUser(participant.user.id, "chat:message", { conversationId: conversation.id, message: messageData });
  }

  return {
    id: message.id,
    sender: user,
    displayContent: content,
    content,
    isTranslated: false,
    conversationId: message.conversationId,
    createdAt: message.createdAt,
  };
};

const deleteMessage = async (userId: string, messageId: string) => {
  const message = (await db.select().from(Messages).where(eq(Messages.id, messageId)))[0];

  if (!message) {
    throw new AppError(ChatErrors.MESSAGE_NOT_FOUND);
  }

  if (message.senderId !== userId) {
    const participant = (
      await db
        .select()
        .from(ConversationParticipants)
        .where(
          and(
            eq(ConversationParticipants.userId, userId),
            eq(ConversationParticipants.conversationId, message.conversationId),
          ),
        )
    )[0];

    if (!participant || !participant.isAdmin) {
      throw new AppError(ChatErrors.NOT_ADMIN);
    }
  }

  await db.delete(MessageTranslations).where(eq(MessageTranslations.messageId, messageId));

  await db.delete(Messages).where(eq(Messages.id, messageId));
};

const getMessageTranslation = async (userId: string, message: Message, languageId: string) => {
  const isUserParticipant = await isParticipant(userId, message.conversationId);

  if (!isUserParticipant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  let translation = (
    await db
      .select()
      .from(MessageTranslations)
      .where(and(eq(MessageTranslations.messageId, message.id), eq(MessageTranslations.targetLanguageId, languageId)))
  )[0];

  if (!translation) {
    try {
      const translatedContent = await translateMessage(message.content, languageId);

      translation = (
        await db
          .insert(MessageTranslations)
          .values({
            messageId: message.id,
            targetLanguageId: languageId,
            translatedContent,
          })
          .onConflictDoUpdate({
            target: [MessageTranslations.messageId, MessageTranslations.targetLanguageId],
            set: {
              translatedContent: sql`${MessageTranslations.translatedContent}`,
            },
          })
          .returning()
      )[0];

      if (!translation) {
        throw new AppError(GenericErrors.UNEXPECTED_ERROR, { translation });
      }
    } catch (error) {
      logger.error({ error }, "Translation error");
      return {
        content: message.content,
        isTranslated: false,
      };
    }
  }

  return {
    content: translation.translatedContent,
    isTranslated: true,
  };
};

const getConversationMessages = async (
  userId: string,
  conversationId: string,
  before: Date,
): Promise<MessageData[]> => {
  const user = await getMinUserById(userId);
  const isUserParticipant = await isParticipant(userId, conversationId);

  if (!isUserParticipant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  const messages = await db
    .select()
    .from(Messages)
    .where(and(eq(Messages.conversationId, conversationId), lte(Messages.createdAt, before)))
    .orderBy(Messages.createdAt)
    .limit(25);

  const messagesWithTranslations = await Promise.all(
    messages.map(async (message) => {
      const sender = await getMinUserById(message.senderId);

      if (!user.languageId || message.senderId === user.id) {
        return {
          id: message.id,
          sender,
          displayContent: message.content,
          content: message.content,
          isTranslated: false,
          conversationId: message.conversationId,
          createdAt: message.createdAt,
        };
      }

      const translation = await getMessageTranslation(userId, message, user.languageId);

      return {
        id: message.id,
        sender,
        displayContent: translation.content,
        content: message.content,
        isTranslated: translation.isTranslated,
        conversationId: message.conversationId,
        createdAt: message.createdAt,
      };
    }),
  );

  return messagesWithTranslations;
};

const addParticipantToGroupConversation = async (userId: string, conversationId: string, newParticipantId: string) => {
  const participant = (
    await db
      .select()
      .from(ConversationParticipants)
      .where(
        and(eq(ConversationParticipants.userId, userId), eq(ConversationParticipants.conversationId, conversationId)),
      )
  )[0];

  if (!participant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  if (!participant.isAdmin) {
    throw new AppError(ChatErrors.NOT_ADMIN);
  }

  const conversation = await getConversationById(conversationId);

  if (!conversation.isGroup) {
    throw new AppError(ChatErrors.NOT_GROUP);
  }

  const existingParticipant = (
    await db
      .select()
      .from(ConversationParticipants)
      .where(
        and(
          eq(ConversationParticipants.userId, newParticipantId),
          eq(ConversationParticipants.conversationId, conversationId),
        ),
      )
  )[0];

  if (existingParticipant) {
    return await getConversationDetails(userId, conversationId);
  }

  const newParticipant = await getMinUserById(newParticipantId);

  if (!areFriends(userId, newParticipantId)) {
    throw new AppError(ChatErrors.NOT_FRIENDS);
  }

  await db.insert(ConversationParticipants).values({
    userId: newParticipant.id,
    conversationId,
    isAdmin: false,
  });

  return await getConversationDetails(userId, conversationId);
};

const removeParticipantFromGroupConversation = async (
  userId: string,
  conversationId: string,
  participantIdToRemove: string,
) => {
  const participant = (
    await db
      .select()
      .from(ConversationParticipants)
      .where(
        and(eq(ConversationParticipants.userId, userId), eq(ConversationParticipants.conversationId, conversationId)),
      )
  )[0];

  if (!participant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  if (userId !== participantIdToRemove && !participant.isAdmin) {
    throw new AppError(ChatErrors.NOT_ADMIN);
  }

  const conversation = await getConversationById(conversationId);

  if (!conversation.isGroup) {
    throw new AppError(ChatErrors.NOT_GROUP);
  }

  if (conversation.createdBy === participantIdToRemove) {
    throw new AppError(ChatErrors.NOT_OWNER);
  }

  await db
    .delete(ConversationParticipants)
    .where(
      and(
        eq(ConversationParticipants.userId, participantIdToRemove),
        eq(ConversationParticipants.conversationId, conversationId),
      ),
    );

  if (userId === participantIdToRemove) {
    return true;
  }

  return await getConversationDetails(userId, conversationId);
};

const updateGroupConversationName = async (userId: string, conversationId: string, name: string) => {
  const participant = (
    await db
      .select()
      .from(ConversationParticipants)
      .where(
        and(eq(ConversationParticipants.userId, userId), eq(ConversationParticipants.conversationId, conversationId)),
      )
  )[0];

  if (!participant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  if (!participant.isAdmin) {
    throw new AppError(ChatErrors.NOT_ADMIN);
  }

  const conversation = await getConversationById(conversationId);

  if (!conversation.isGroup) {
    throw new AppError(ChatErrors.NOT_GROUP);
  }

  await db.update(Conversations).set({ name }).where(eq(Conversations.id, conversationId));

  return await getConversationDetails(userId, conversationId);
};

const makeGroupConversationParticipantAdmin = async (userId: string, conversationId: string, participantId: string) => {
  const participant = (
    await db
      .select()
      .from(ConversationParticipants)
      .where(
        and(eq(ConversationParticipants.userId, userId), eq(ConversationParticipants.conversationId, conversationId)),
      )
  )[0];

  if (!participant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  if (!participant.isAdmin) {
    throw new AppError(ChatErrors.NOT_ADMIN);
  }

  const conversation = await getConversationById(conversationId);

  if (!conversation.isGroup) {
    throw new AppError(ChatErrors.NOT_GROUP);
  }

  if (conversation.createdBy === participantId) {
    throw new AppError(ChatErrors.NOT_OWNER);
  }

  await db
    .update(ConversationParticipants)
    .set({ isAdmin: sql`NOT ${ConversationParticipants.isAdmin}` })
    .where(
      and(
        eq(ConversationParticipants.userId, participantId),
        eq(ConversationParticipants.conversationId, conversationId),
      ),
    );

  return await getConversationDetails(userId, conversationId);
};

const leaveGroupConversation = async (userId: string, conversationId: string) => {
  await removeParticipantFromGroupConversation(userId, conversationId, userId);
};

const deleteGroupConversation = async (userId: string, conversationId: string) => {
  const participant = (
    await db
      .select()
      .from(ConversationParticipants)
      .where(
        and(eq(ConversationParticipants.userId, userId), eq(ConversationParticipants.conversationId, conversationId)),
      )
  )[0];

  if (!participant) {
    throw new AppError(ChatErrors.NOT_PARTICIPANT);
  }

  if (!participant.isAdmin) {
    throw new AppError(ChatErrors.NOT_ADMIN);
  }

  const conversation = await getConversationById(conversationId);

  if (conversation.createdBy !== userId) {
    throw new AppError(ChatErrors.NOT_OWNER);
  }

  await db.delete(ConversationParticipants).where(eq(ConversationParticipants.conversationId, conversationId));
  await db.delete(MessageTranslations).where(eq(MessageTranslations.messageId, conversationId));
  await db.delete(Messages).where(eq(Messages.conversationId, conversationId));
  await db.delete(Conversations).where(eq(Conversations.id, conversationId));
};

export {
  createDirectConversation,
  createGroupConversation,
  getConversationDetails,
  isParticipant,
  getUserConversations,
  deleteMessage,
  sendMessage,
  getConversationMessages,
  addParticipantToGroupConversation,
  removeParticipantFromGroupConversation,
  updateGroupConversationName,
  makeGroupConversationParticipantAdmin,
  leaveGroupConversation,
  deleteGroupConversation,
};
