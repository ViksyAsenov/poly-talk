import { ServiceType } from "@common/constants/serviceType";
import { IAppError } from "@common/error/types";

enum LANGUAGE_ERROR_KEYS {
  NOT_FOUND = "NOT_FOUND",
  TRANSLATION_FAILED = "TRANSLATION_FAILED",
}

const LanguageErrors: Record<LANGUAGE_ERROR_KEYS, IAppError> = {
  [LANGUAGE_ERROR_KEYS.NOT_FOUND]: {
    message_error: "No language was found.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [LANGUAGE_ERROR_KEYS.TRANSLATION_FAILED]: {
    message_error: "Translation failed.",
    status_code: 400,
    service: ServiceType.USER,
  },
};

export { LanguageErrors, LANGUAGE_ERROR_KEYS };
