import { IMinUser } from "@services/user/types";

interface MessageData {
  id: string;
  sender: IMinUser;
  displayContent: string;
  content: string;
  isTranslated: boolean;
  conversationId: string;
  createdAt: Date;
}

export { MessageData };
