import { Request, Response, NextFunction } from "express";

import { ExpressFunction } from "@common/types/express";

import logger from "@config/logger";
import { AppError } from "@common/error/appError";

function asyncErrorHandler(fn: ExpressFunction) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: unknown) => {
      if (error instanceof AppError) {
        return res.status(error.status_code).json({
          success: false,
          error: {
            message_error: error.message_error,
            notify: error.notify,
          },
        });
      }

      logger.error({ error }, "Unhandled error in asyncErrorHandler");

      return res.status(500).json({
        success: false,
        error: {
          message_error: "Internal server error.",
        },
      });
    });
  };
}

export default asyncErrorHandler;
