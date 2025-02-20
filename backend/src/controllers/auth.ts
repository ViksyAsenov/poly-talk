import { Request, Response } from 'express';
import config from '@config/env';

import { getGoogleLoginUrl as getGoogleLoginUrlService, validateAndGetUser } from '@services/auth';

import asyncErrorHandler from 'src/utils/asyncErrorHandler';
import logger from '@config/logger';

const getGoogleLoginUrl = asyncErrorHandler((req: Request, res: Response) => {
  const steamLoginUrl = getGoogleLoginUrlService();

  res.json({ success: true, data: steamLoginUrl });
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
    logger.error({ error }, 'Error handling google callback');

    res.redirect(config.app.client_url);
  }
});

export { getGoogleLoginUrl, handleGoogleCallback };
