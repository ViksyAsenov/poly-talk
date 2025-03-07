import { ServiceType } from "@common/constants/serviceType";
import { IAppError } from "@common/error/types";

enum CHAT_ERROR_KEYS {
  NOT_FOUND = "NOT_FOUND",
  NOT_PARTICIPANT = "NOT_PARTICIPANT",
  MESSAGE_NOT_FOUND = "MESSAGE_NOT_FOUND",
  NOT_FRIENDS = "NOT_FRIENDS",
  INVALID_GROUP_DATA = "INVALID_GROUP_DATA",
  CANNOT_MESSAGE_SELF = "CANNOT_MESSAGE_SELF",
  NOT_ADMIN = "NOT_ADMIN",
  NOT_GROUP = "NOT_GROUP",
}

const ChatErrors: Record<CHAT_ERROR_KEYS, IAppError> = {
  [CHAT_ERROR_KEYS.NOT_FOUND]: {
    message_error: "No chat was found.",
    status_code: 400,
    service: ServiceType.USER,
  },
  [CHAT_ERROR_KEYS.NOT_PARTICIPANT]: {
    message_error: "User is not a participant in this conversation.",
    status_code: 403,
    service: ServiceType.CHAT,
  },
  [CHAT_ERROR_KEYS.MESSAGE_NOT_FOUND]: {
    message_error: "The message was not found.",
    status_code: 404,
    service: ServiceType.CHAT,
  },
  [CHAT_ERROR_KEYS.NOT_FRIENDS]: {
    message_error: "Users are not friends.",
    status_code: 403,
    service: ServiceType.CHAT,
  },
  [CHAT_ERROR_KEYS.INVALID_GROUP_DATA]: {
    message_error: "The provided group data is invalid.",
    status_code: 400,
    service: ServiceType.CHAT,
  },
  [CHAT_ERROR_KEYS.CANNOT_MESSAGE_SELF]: {
    message_error: "Users cannot message themselves.",
    status_code: 400,
    service: ServiceType.CHAT,
  },
  [CHAT_ERROR_KEYS.NOT_ADMIN]: {
    message_error: "User is not an admin of this group.",
    status_code: 403,
    service: ServiceType.CHAT,
  },
  [CHAT_ERROR_KEYS.NOT_GROUP]: {
    message_error: "Chat is not a group chat.",
    status_code: 400,
    service: ServiceType.CHAT,
  },
};

export { ChatErrors, CHAT_ERROR_KEYS };
