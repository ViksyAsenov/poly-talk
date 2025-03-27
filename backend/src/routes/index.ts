import { Router } from "express";

import authRouter from "@routes/auth";

import userRouter from "@routes/user";

import chatRouter from "@routes/chat";

import languageRouter from "@routes/language";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

mainRouter.use("/user", userRouter);

mainRouter.use("/chat", chatRouter);

mainRouter.use("/language", languageRouter);

export default mainRouter;
