import { Request, Response } from "express";

import {
  getMinUserById as getMinUserByIdService,
  updateUserProfile as updateUserProfileService,
  sendFriendRequest as sendFriendRequestService,
  getFriendRequests as getFriendRequestsService,
  acceptFriendRequest as acceptFriendRequestService,
  rejectFriendRequest as rejectFriendRequestService,
  getFriends as getFriendsService,
  removeFriend as removeFriendService,
} from "@services/user";

import asyncErrorHandler from "@utils/asyncErrorHandler";
import { TUuidParamsOrBody } from "@common/validations/uuidParamsOrBody";
import { TTagParams } from "@services/user/validations/friend";
import { TUpdateUserBody } from "@services/user/validations/user";

const getUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const user = await getMinUserByIdService(req.user.id);

  res.json({ success: true, data: user });
});

const updateUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const updateUser = req.body as TUpdateUserBody;
  const user = await updateUserProfileService(req.user.id, updateUser);

  res.json({ success: true, data: user });
});

const sendFriendRequest = asyncErrorHandler(async (req: Request, res: Response) => {
  const { tag } = req.params as TTagParams;
  const request = await sendFriendRequestService(req.user.id, tag);

  res.json({ success: true, data: request });
});

const getFriendRequests = asyncErrorHandler(async (req: Request, res: Response) => {
  const requests = await getFriendRequestsService(req.user.id);

  res.json({ success: true, data: requests });
});

const acceptFriendRequest = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TUuidParamsOrBody;
  const acceptedRequest = await acceptFriendRequestService(req.user.id, id);

  res.json({ success: true, data: acceptedRequest });
});

const rejectFriendRequest = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TUuidParamsOrBody;
  const rejectedRequest = await rejectFriendRequestService(req.user.id, id);

  res.json({ success: true, data: rejectedRequest });
});

const getFriends = asyncErrorHandler(async (req: Request, res: Response) => {
  const friends = await getFriendsService(req.user.id);

  res.json({ success: true, data: friends });
});

const removeFriend = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TUuidParamsOrBody;
  const removed = await removeFriendService(req.user.id, id);

  res.json({ success: true, data: removed });
});

export {
  getUser,
  updateUser,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
};
