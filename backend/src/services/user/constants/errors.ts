import { ServiceType } from "@common/constants/serviceType";
import { IAppError } from "@common/error/types";

enum USER_ERROR_KEYS {
  NOT_FOUND = "NOT_FOUND",
  INVALID_TAG = "INVALID_TAG",
  CANNOT_FRIEND_SELF = "CANNOT_FRIEND_SELF",
  ALREADY_FRIENDS = "ALREADY_FRIENDS",
  REQUEST_ALREADY_SENT = "REQUEST_ALREADY_SENT",
  REQUEST_NOT_FOUND = "REQUEST_NOT_FOUND",
  REQUEST_ALREADY_PROCESSED = "REQUEST_ALREADY_PROCESSED",
  NOT_FRIENDS = "NOT_FRIENDS",
}

const UserErrors: Record<USER_ERROR_KEYS, IAppError> = {
  [USER_ERROR_KEYS.NOT_FOUND]: {
    message_error: "No user was found.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.INVALID_TAG]: {
    message_error: "This is an invalid tag.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.CANNOT_FRIEND_SELF]: {
    message_error: "You cannot friend yourself.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.ALREADY_FRIENDS]: {
    message_error: "You are already friends.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.REQUEST_ALREADY_SENT]: {
    message_error: "A friend request has already been sent.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.REQUEST_NOT_FOUND]: {
    message_error: "No friend request was found.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.REQUEST_ALREADY_PROCESSED]: {
    message_error: "The friend request has already been processed.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [USER_ERROR_KEYS.NOT_FRIENDS]: {
    message_error: "You are not friends.",
    status_code: 400,
    service: ServiceType.USER,
  },
};

export { UserErrors, USER_ERROR_KEYS };
