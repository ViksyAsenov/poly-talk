import { ServiceType } from '@common/constants/serviceType';
import { IAppError } from '@common/error/types';

enum AUTH_ERROR_KEYS {
  UNAUTHORIZED = 'UNAUTHORIZED',
  ALREADY_AUTHORIZED = 'ALREADY_AUTHORIZED',
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
}

const AuthErrors: Record<AUTH_ERROR_KEYS, IAppError> = {
  [AUTH_ERROR_KEYS.UNAUTHORIZED]: {
    message_error: 'You are unauthorized.',
    status_code: 401,
    service: ServiceType.AUTH,
  },
  [AUTH_ERROR_KEYS.ALREADY_AUTHORIZED]: {
    message_error: 'You are already authorized.',
    status_code: 400,
    service: ServiceType.AUTH,
  },
  [AUTH_ERROR_KEYS.INVALID_ACCESS_TOKEN]: {
    message_error: 'Invalid access token.',
    status_code: 401,
    service: ServiceType.AUTH,
  },
  [AUTH_ERROR_KEYS.ACCESS_TOKEN_EXPIRED]: {
    message_error: 'Access token has expired.',
    status_code: 401,
    service: ServiceType.AUTH,
  },
  [AUTH_ERROR_KEYS.INVALID_REFRESH_TOKEN]: {
    message_error: 'Invalid refresh token.',
    status_code: 401,
    service: ServiceType.AUTH,
  },
  [AUTH_ERROR_KEYS.REFRESH_TOKEN_EXPIRED]: {
    message_error: 'Refresh token has expired.',
    status_code: 401,
    service: ServiceType.AUTH,
  },
};

export { AuthErrors, AUTH_ERROR_KEYS };
