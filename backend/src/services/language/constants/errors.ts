import { ServiceType } from "@common/constants/serviceType";
import { IAppError } from "@common/error/types";

enum LANGUAGE_ERROR_KEYS {
  NOT_FOUND = "NOT_FOUND",
}

const LanguageErrors: Record<LANGUAGE_ERROR_KEYS, IAppError> = {
  [LANGUAGE_ERROR_KEYS.NOT_FOUND]: {
    message_error: "No language was found.",
    status_code: 400,
    service: ServiceType.USER,
  },
};

export { LanguageErrors, LANGUAGE_ERROR_KEYS };
