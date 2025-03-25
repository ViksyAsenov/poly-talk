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
} from "@controllers/chat";
import { validateBodySchema, validateParamsSchema } from "@middlewares/validation";
import { uuidParamsOrBodyValidation } from "@common/validations/uuidParamsOrBody";
import {
  createGroupConversationBodyValidation,
  sendMessageBodyValidation,
  updateGroupConversationNameBodyValidation,
  updateGroupConversationParticipantBodyValidation,
} from "@services/chat/validations/chat";

const router = Router();

router.get("/conversation", isAuth, getUserConversations);

router.get("/conversation/:id", isAuth, validateBodySchema(uuidParamsOrBodyValidation), getConversationDetails);

router.get(
  "/conversation/:id/messages",
  isAuth,
  validateParamsSchema(uuidParamsOrBodyValidation),
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

router.post("/message", isAuth, validateBodySchema(sendMessageBodyValidation), sendMessage);

router.delete("/message", isAuth, validateBodySchema(uuidParamsOrBodyValidation), deleteMessage);

export default router;
