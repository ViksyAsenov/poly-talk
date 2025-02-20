import logger from '@config/logger';

import { IAppError } from '@common/error/types';

class AppError extends Error {
  public stack: string | undefined;
  public message_error: string;
  public status_code: number;
  public additional: unknown;
  public service: string;
  public notify: boolean;

  constructor(error: IAppError, additional?: unknown, notify = true) {
    super(error.message_error);

    this.message = error.message_error;
    this.additional = additional;
    this.message_error = error.message_error;
    this.name = 'AppError';
    this.stack = new Error().stack;
    this.status_code = error.status_code;
    this.service = error.service;
    this.notify = notify;

    logger.error(
      {
        ...(additional || {}),
        service: error.service,

        message_error: error.message_error,
        status_code: error.status_code,
      },
      `Service: ${error.service} - ${error.message_error}`,
    );
  }
}

export { AppError };
