import { NextFunction, Request, Response } from "express";
import config from "@config/env";

import { getGoogleLoginUrl as getGoogleLoginUrlService, validateAndGetUser } from "@services/auth";

import asyncErrorHandler from "src/utils/asyncErrorHandler";
import logger from "@config/logger";

const getGoogleLoginUrl = asyncErrorHandler((req: Request, res: Response) => {
  const googleLoginUrl = getGoogleLoginUrlService();

  res.json({ success: true, data: googleLoginUrl });
});

const handleGoogleCallback = asyncErrorHandler(async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    const user = await validateAndGetUser(code as string);

    req.session.regenerate(() => {
      req.session.user = user;

      req.session.save(() => {
        res.redirect(config.app.client_url);
      });
    });
  } catch (error) {
    logger.error({ error }, "Error handling google callback");

    res.redirect(config.app.client_url);
  }
});

const logout = asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) next(err);

    res.json({
      success: true,
      data: null,
    });
  });
});

export { getGoogleLoginUrl, handleGoogleCallback, logout };
