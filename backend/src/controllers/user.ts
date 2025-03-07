import { Request, Response } from "express";

import { getMinUserById as getMinUserByIdService, updateUserProfile as updateUserProfileService } from "@services/user";

import asyncErrorHandler from "@utils/asyncErrorHandler";

const getMinUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = await getMinUserByIdService(req.user.id);

  res.json({ success: true, data: user });
});

const updateUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = await updateUserProfileService(req.user.id, { email: Math.random().toFixed(5) });

  res.json({ success: true, data: user });
});

export { getMinUser, updateUser };
