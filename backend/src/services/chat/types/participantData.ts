import { IMinUser } from "@services/user/types";

interface ParticipantData {
  id: string;
  user: IMinUser;
  conversationId: string;
  isAdmin: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export { ParticipantData };
