import { ServiceType } from '@common/constants/serviceType';
import { IAppError } from '@common/error/types';

enum GENERIC_ERROR_KEYS {
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
}

const GenericErrors: Record<GENERIC_ERROR_KEYS, IAppError> = {
  [GENERIC_ERROR_KEYS.UNEXPECTED_ERROR]: {
    message_error: 'An unexpected error occurred.',
    status_code: 500,
    service: ServiceType.NONE,
  },
  [GENERIC_ERROR_KEYS.TOO_MANY_REQUESTS]: {
    message_error: 'You have made too many requests.',
    status_code: 429,
    service: ServiceType.NONE,
  },
};

export { GenericErrors, GENERIC_ERROR_KEYS };
