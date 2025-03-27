interface APIResponseSuccess<T> {
  success: true;
  data: T;
}

interface APIResponseError {
  success: false;
  data: {
    message_error: string;
    notify: boolean;
  };
}

type APIResponse<T> = APIResponseSuccess<T> | APIResponseError;

export type { APIResponse };
