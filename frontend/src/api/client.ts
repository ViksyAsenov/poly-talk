import { APIResponse } from "../types/api";
import { Message, Conversation, SendMessageRequest } from "../types/chat";
import { IFriendRequests, IMinUser, Language } from "../types/user";
import { client } from "./config";

const authApi = {
  getGoogleLoginUrl: () => client.get<APIResponse<string>>("/auth/google"),
  logout: () => client.post("/auth/logout"),
};

const userApi = {
  getMe: () => client.get<APIResponse<IMinUser>>("/user/me"),
  updateMe: (
    displayName?: string,
    firstName?: string,
    lastName?: string,
    languageId?: string
  ) =>
    client.patch<APIResponse<IMinUser>>("/user/me", {
      displayName,
      firstName,
      lastName,
      languageId,
    }),
  sendFriendRequest: (tag: string) => client.post("/user/friends", { tag }),
  getPendingFriendRequests: () =>
    client.get<APIResponse<IFriendRequests>>("/user/friends/requests"),
  acceptFriendRequest: (id: string) =>
    client.post(`/user/friends/requests/${id}/accept`),
  rejectFriendRequest: (id: string) =>
    client.post(`/user/friends/requests/${id}/reject`),
  getFriends: () => client.get<APIResponse<IMinUser[]>>("/user/friends"),
  removeFriend: (id: string) => client.delete(`/user/friends/${id}`),
  getLanguages: () => client.get<APIResponse<Language[]>>("/language"),
};

const chatApi = {
  getConversations: () =>
    client.get<APIResponse<Conversation[]>>("/chat/conversation"),
  getConversationDetails: (id: string) =>
    client.get<APIResponse<Conversation>>(`/chat/conversation/${id}`),
  getMessages: (conversationId: string) =>
    client.get<APIResponse<Message[]>>(
      `/chat/conversation/${conversationId}/messages`
    ),
  createDirectConversation: (userId: string) =>
    client.post("/chat/conversation/direct", { id: userId }),
  createGroupConversation: (name: string, participantIds: string[]) =>
    client.post("/chat/conversation/group", { name, participantIds }),
  updateGroupConversationName: (id: string, name: string) =>
    client.put("/chat/conversation/group/name", { id, name }),
  addParticipantToGroupConversation: (id: string, participantId: string) =>
    client.post("/chat/conversation/group/participant", { id, participantId }),
  makeParticipantAdmin: (id: string, participantId: string) =>
    client.put("/chat/conversation/group/participant", { id, participantId }),
  removeParticipantFromGroupConversation: (id: string, participantId: string) =>
    client.post("/chat/conversation/group/participant/kick", {
      id,
      participantId,
    }),
  leaveGroupConversation: (id: string) =>
    client.post("/chat/conversation/group/participant/leave", { id }),
  sendMessage: (data: SendMessageRequest) =>
    client.post<APIResponse<Message>>("/chat/message", data),
  deleteMessage: (messageId: string) =>
    client.delete(`/chat/message/${messageId}`),
};

export { authApi, userApi, chatApi };
