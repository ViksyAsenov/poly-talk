import { Router } from "express";
import { isAuth } from "@middlewares/auth";
import {
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
  deleteGroupConversation,
} from "@controllers/chat";
import { validateBodySchema, validateParamsSchema, validateQuerySchema } from "@middlewares/validation";
import { uuidParamsOrBodyValidation } from "@common/validations/uuidParamsOrBody";
import {
  createGroupConversationBodyValidation,
  getChatMessagesQueryValidation,
  sendMessageBodyValidation,
  updateGroupConversationNameBodyValidation,
  updateGroupConversationParticipantBodyValidation,
} from "@services/chat/validations/chat";

const router = Router();

router.get("/conversation", isAuth, getUserConversations);

router.get("/conversation/:id", isAuth, validateBodySchema(uuidParamsOrBodyValidation), getConversationDetails);

router.post("/message", isAuth, validateBodySchema(sendMessageBodyValidation), sendMessage);

router.delete("/message/:id", isAuth, validateParamsSchema(uuidParamsOrBodyValidation), deleteMessage);

router.get(
  "/conversation/:id/messages",
  isAuth,
  validateParamsSchema(uuidParamsOrBodyValidation),
  validateQuerySchema(getChatMessagesQueryValidation),
  getConversationMessages,
);

router.post("/conversation/direct", isAuth, validateBodySchema(uuidParamsOrBodyValidation), createDirectConversation);

router.post(
  "/conversation/group",
  isAuth,
  validateBodySchema(createGroupConversationBodyValidation),
  createGroupConversation,
);

router.put(
  "/conversation/group/name",
  isAuth,
  validateBodySchema(updateGroupConversationNameBodyValidation),
  updateGroupConversationName,
);

router.post(
  "/conversation/group/participant",
  isAuth,
  validateBodySchema(updateGroupConversationParticipantBodyValidation),
  addParticipantToGroupConversation,
);

router.put(
  "/conversation/group/participant",
  isAuth,
  validateBodySchema(updateGroupConversationParticipantBodyValidation),
  makeGroupConversationParticipantAdmin,
);

router.post(
  "/conversation/group/participant/kick",
  isAuth,
  validateBodySchema(updateGroupConversationParticipantBodyValidation),
  removeParticipantFromGroupConversation,
);

router.post(
  "/conversation/group/participant/leave",
  isAuth,
  validateBodySchema(uuidParamsOrBodyValidation),
  leaveGroupConversation,
);

router.post(
  "/conversation/group/delete",
  isAuth,
  validateBodySchema(uuidParamsOrBodyValidation),
  deleteGroupConversation,
);

export default router;
