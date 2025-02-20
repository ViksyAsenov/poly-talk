import { ServiceType } from '@common/constants/serviceType';

interface IAppErrorWithoutService {
  message_error: string;
  status_code: number;
}

interface IAppError extends IAppErrorWithoutService {
  service: ServiceType;
}

export type { IAppErrorWithoutService, IAppError };
