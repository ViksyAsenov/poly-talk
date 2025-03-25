import { ParticipantData } from "@services/chat/types/participantData";

interface ConversationData {
  id: string;
  participants: ParticipantData[];
  name: string | null;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
  preview: string | null;
  lastActivity: Date;
}

export { ConversationData };
