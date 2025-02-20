import { GoogleToken } from '@services/auth/types';

function validateGoogleTokenReturn(data: unknown): data is GoogleToken {
  return (
    typeof data === 'object' &&
    typeof (data as GoogleToken).access_token === 'string' &&
    typeof (data as GoogleToken).expires_in === 'number' &&
    typeof (data as GoogleToken).token_type === 'string' &&
    typeof (data as GoogleToken).scope === 'string' &&
    typeof (data as GoogleToken).id_token === 'string'
  );
}

export { validateGoogleTokenReturn };
