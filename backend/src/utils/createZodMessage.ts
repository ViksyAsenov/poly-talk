import { IAppError } from "@common/error/types";

const createZodMessage = (error: IAppError) => {
  return `${error.status_code.toString()}/${error.message_error}`;
};

export { createZodMessage };
