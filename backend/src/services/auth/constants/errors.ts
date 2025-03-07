import { ServiceType } from "@common/constants/serviceType";
import { IAppError } from "@common/error/types";

enum AUTH_ERROR_KEYS {
  UNAUTHORIZED = "UNAUTHORIZED",
  ALREADY_AUTHORIZED = "ALREADY_AUTHORIZED",
}

const AuthErrors: Record<AUTH_ERROR_KEYS, IAppError> = {
  [AUTH_ERROR_KEYS.UNAUTHORIZED]: {
    message_error: "You are unauthorized.",
    status_code: 401,
    service: ServiceType.AUTH,
  },
  [AUTH_ERROR_KEYS.ALREADY_AUTHORIZED]: {
    message_error: "You are already authorized.",
    status_code: 400,
    service: ServiceType.AUTH,
  },
};

export { AuthErrors, AUTH_ERROR_KEYS };
