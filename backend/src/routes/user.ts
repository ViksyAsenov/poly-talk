import { Router } from "express";
import { isAuth } from "@middlewares/auth";
import {
  getUser,
  updateUser,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
} from "@controllers/user";
import { validateBodySchema, validateParamsSchema } from "@middlewares/validation";
import { tagParamsValidation } from "@services/user/validations/friend";
import { uuidParamsOrBodyValidation } from "@common/validations/uuidParamsOrBody";
import { updateUserBodyValidation } from "@services/user/validations/user";

const router = Router();

router.get("/me", isAuth, getUser);

router.patch("/me", isAuth, validateBodySchema(updateUserBodyValidation), updateUser);

router.post("/friends/:tag", isAuth, validateParamsSchema(tagParamsValidation), sendFriendRequest);

router.get("/friends/requests", isAuth, getFriendRequests);

router.post(
  "/friends/requests/:id/accept",
  isAuth,
  validateParamsSchema(uuidParamsOrBodyValidation),
  acceptFriendRequest,
);

router.post(
  "/friends/requests/:id/reject",
  isAuth,
  validateParamsSchema(uuidParamsOrBodyValidation),
  rejectFriendRequest,
);

router.get("/friends", isAuth, getFriends);

router.delete("/friends/:id", isAuth, validateParamsSchema(uuidParamsOrBodyValidation), removeFriend);

export default router;
