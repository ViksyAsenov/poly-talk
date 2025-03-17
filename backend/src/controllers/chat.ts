import { Request, Response } from "express";

import {
  createDirectConversation as createDirectConversationService,
  createGroupConversation as createGroupConversationService,
  getConversationDetails as getConversationDetailsService,
} from "@services/chat";

import asyncErrorHandler from "@utils/asyncErrorHandler";
import { TUuidParamsOrBody } from "@common/validations/uuidParamsOrBody";

const createDirectConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.body as TUuidParamsOrBody;
  const conversation = await createDirectConversationService(req.user.id, id);

  res.json({ success: true, data: conversation });
});

export { createDirectConversation };
