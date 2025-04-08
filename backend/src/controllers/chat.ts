import { Request, Response } from "express";

import {
  createDirectConversation as createDirectConversationService,
  createGroupConversation as createGroupConversationService,
  getConversationDetails as getConversationDetailsService,
  getUserConversations as getUserConversationsService,
  sendMessage as sendMessageService,
  getConversationMessages as getConversationMessagesService,
  addParticipantToGroupConversation as addParticipantToGroupConversationService,
  removeParticipantFromGroupConversation as removeParticipantFromGroupConversationService,
  updateGroupConversationName as updateGroupConversationNameService,
  makeGroupConversationParticipantAdmin as makeGroupConversationParticipantAdminService,
  deleteMessage as deleteMessageService,
  leaveGroupConversation as leaveGroupConversationService,
} from "@services/chat";

import asyncErrorHandler from "@utils/asyncErrorHandler";
import { TUuidParamsOrBody } from "@common/validations/uuidParamsOrBody";
import {
  TCreateGroupConversationBody,
  TSendMessageBody,
  TUpdateGroupConversationNameBody,
  TUpdateGroupConversationParticipantBody,
} from "@services/chat/validations/chat";

const createDirectConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.body as TUuidParamsOrBody;
  const conversation = await createDirectConversationService(req.user.id, id);

  res.json({ success: true, data: conversation });
});

const createGroupConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  const { name, participantIds } = req.body as TCreateGroupConversationBody;
  const conversation = await createGroupConversationService(req.user.id, name, participantIds);

  res.json({ success: true, data: conversation });
});

const getConversationDetails = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TUuidParamsOrBody;
  const conversation = await getConversationDetailsService(req.user.id, id);

  res.json({ success: true, data: conversation });
});

const getUserConversations = asyncErrorHandler(async (req: Request, res: Response) => {
  const conversations = await getUserConversationsService(req.user.id);

  res.json({ success: true, data: conversations });
});

const sendMessage = asyncErrorHandler(async (req: Request, res: Response) => {
  const { conversationId, content } = req.body as TSendMessageBody;
  const message = await sendMessageService(req.user.id, conversationId, content);

  res.json({ success: true, data: message });
});

const getConversationMessages = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TUuidParamsOrBody;
  const messages = await getConversationMessagesService(req.user.id, id);

  res.json({ success: true, data: messages });
});

const addParticipantToGroupConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  const { conversationId, participantId } = req.body as TUpdateGroupConversationParticipantBody;
  const conversation = await addParticipantToGroupConversationService(req.user.id, conversationId, participantId);

  res.json({ success: true, data: conversation });
});

const removeParticipantFromGroupConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  const { conversationId, participantId } = req.body as TUpdateGroupConversationParticipantBody;
  const conversation = await removeParticipantFromGroupConversationService(req.user.id, conversationId, participantId);

  res.json({ success: true, data: conversation });
});

const updateGroupConversationName = asyncErrorHandler(async (req: Request, res: Response) => {
  const { conversationId, name } = req.body as TUpdateGroupConversationNameBody;
  const conversation = await updateGroupConversationNameService(req.user.id, conversationId, name);

  res.json({ success: true, data: conversation });
});

const makeGroupConversationParticipantAdmin = asyncErrorHandler(async (req: Request, res: Response) => {
  const { conversationId, participantId } = req.body as TUpdateGroupConversationParticipantBody;
  const conversation = await makeGroupConversationParticipantAdminService(req.user.id, conversationId, participantId);

  res.json({ success: true, data: conversation });
});

const deleteMessage = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.body as TUuidParamsOrBody;
  await deleteMessageService(req.user.id, id);

  res.json({ success: true, data: null });
});

const leaveGroupConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.body as TUuidParamsOrBody;
  await leaveGroupConversationService(req.user.id, id);

  res.json({ success: true, data: null });
});

export {
  createDirectConversation,
  createGroupConversation,
  getConversationDetails,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  addParticipantToGroupConversation,
  removeParticipantFromGroupConversation,
  updateGroupConversationName,
  makeGroupConversationParticipantAdmin,
  deleteMessage,
  leaveGroupConversation,
};
