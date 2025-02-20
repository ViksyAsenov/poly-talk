import { Request, Response, NextFunction } from 'express';

import { ExpressFunction } from '@common/types/express';

import logger from '@config/logger';
import { AppError } from '@common/error/appError';

function asyncErrorHandler(fn: ExpressFunction) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: unknown) => {
      if (err instanceof AppError) {
        return res.status(err.status_code).json({
          success: false,
          error: {
            message_error: err.message_error,
            ...(!err.notify && {
              notify: false,
            }),
          },
        });
      }

      logger.error({ err }, 'Unhandled error in asyncErrorHandler');

      return res.status(500).json({
        success: false,
        error: {
          message_error: 'Internal server error.',
        },
      });
    });
  };
}

export default asyncErrorHandler;
