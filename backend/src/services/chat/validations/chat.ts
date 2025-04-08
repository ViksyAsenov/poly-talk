import { z } from "zod";

import { createZodMessage } from "@utils/createZodMessage";
import { ChatErrors } from "../constants";

const createGroupConversationBodyValidation = z.object({
  name: z
    .string({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) })
    .min(1, { message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) }),
  participantIds: z
    .string({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) })
    .uuid({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) })
    .array(),
});

const sendMessageBodyValidation = z.object({
  conversationId: z
    .string({ message: createZodMessage(ChatErrors.INVALID_MESSAGE_DATA) })
    .uuid({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) }),
  content: z
    .string({ message: createZodMessage(ChatErrors.INVALID_MESSAGE_DATA) })
    .min(1, { message: createZodMessage(ChatErrors.INVALID_MESSAGE_DATA) }),
});

const updateGroupConversationNameBodyValidation = z.object({
  conversationId: z
    .string({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) })
    .uuid({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) }),
  name: z
    .string({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) })
    .min(1, { message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) }),
});

const updateGroupConversationParticipantBodyValidation = z.object({
  conversationId: z
    .string({ message: createZodMessage(ChatErrors.INVALID_PARTICIPANT_DATA) })
    .uuid({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) }),
  participantId: z
    .string({ message: createZodMessage(ChatErrors.INVALID_PARTICIPANT_DATA) })
    .uuid({ message: createZodMessage(ChatErrors.INVALID_GROUP_DATA) }),
});

export type TCreateGroupConversationBody = z.infer<typeof createGroupConversationBodyValidation>;
export type TSendMessageBody = z.infer<typeof sendMessageBodyValidation>;
export type TUpdateGroupConversationNameBody = z.infer<typeof updateGroupConversationNameBodyValidation>;
export type TUpdateGroupConversationParticipantBody = z.infer<typeof updateGroupConversationParticipantBodyValidation>;

export {
  createGroupConversationBodyValidation,
  sendMessageBodyValidation,
  updateGroupConversationNameBodyValidation,
  updateGroupConversationParticipantBodyValidation,
};
