import { Router } from "express";

import authRouter from "@routes/auth";

import userRouter from "@routes/user";

import chatRouter from "@routes/chat";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

mainRouter.use("/user", userRouter);

mainRouter.use("/chat", chatRouter);

export default mainRouter;
