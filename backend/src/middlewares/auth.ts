import { Request, Response, NextFunction } from "express";

import { AuthErrors } from "@services/auth/constants";

import { AppError } from "@common/error/appError";

import asyncErrorHandler from "@utils/asyncErrorHandler";

// eslint-disable-next-line @typescript-eslint/require-await
const isAuth = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    throw new AppError(AuthErrors.UNAUTHORIZED);
  }

  req.user = req.session.user;

  next();
});

// eslint-disable-next-line @typescript-eslint/require-await
const isNotAuth = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    throw new AppError(AuthErrors.ALREADY_AUTHORIZED);
  }

  next();
});

export { isAuth, isNotAuth };
