import { IMinUser } from "./user";

interface Message {
  id: string;
  sender: IMinUser;
  displayContent: string;
  content: string;
  isTranslated: boolean;
  conversationId: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  participants: Participant[];
  name: string | null;
  isGroup: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  preview: string | null;
  lastActivity: Date | string;
}

interface Participant {
  id: string;
  user: IMinUser;
  conversationId: string;
  isAdmin: boolean;
  updatedAt: Date;
  createdAt: Date;
}

interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export type { Message, Conversation, Participant, SendMessageRequest };
