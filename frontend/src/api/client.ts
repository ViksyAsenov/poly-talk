import { APIResponse } from "../types/api";
import { Message, Conversation, SendMessageRequest } from "../types/chat";
import { IFriendRequests, IMinUser, Language } from "../types/user";
import { client } from "./config";

const authApi = {
  getGoogleLoginUrl: () => client.get<APIResponse<string>>("/auth/google"),
  logout: () => client.post<APIResponse<null>>("/auth/logout"),
};

const userApi = {
  getMe: () => client.get<APIResponse<IMinUser>>("/user/me"),
  updateMe: (displayName?: string, languageId?: string) =>
    client.patch<APIResponse<IMinUser>>("/user/me", {
      displayName,
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
  sendMessage: (data: SendMessageRequest) =>
    client.post<APIResponse<Message>>("/chat/message", data),
  deleteMessage: (messageId: string) =>
    client.delete(`/chat/message/${messageId}`),
  getMessages: (conversationId: string, before: string) =>
    client.get<APIResponse<Message[]>>(
      `/chat/conversation/${conversationId}/messages?before=${encodeURIComponent(
        before
      )}`
    ),
  createDirectConversation: (userId: string) =>
    client.post("/chat/conversation/direct", { id: userId }),
  createGroupConversation: (name: string, participantIds: string[]) =>
    client.post("/chat/conversation/group", { name, participantIds }),
  updateGroupConversationName: (conversationId: string, name: string) =>
    client.put<APIResponse<Conversation>>("/chat/conversation/group/name", {
      conversationId,
      name,
    }),
  addParticipantToGroupConversation: (
    conversationId: string,
    participantId: string
  ) =>
    client.post<APIResponse<Conversation>>(
      "/chat/conversation/group/participant",
      {
        conversationId,
        participantId,
      }
    ),
  makeParticipantAdmin: (conversationId: string, participantId: string) =>
    client.put<APIResponse<Conversation>>(
      "/chat/conversation/group/participant",
      {
        conversationId,
        participantId,
      }
    ),
  removeParticipantFromGroupConversation: (
    conversationId: string,
    participantId: string
  ) =>
    client.post<APIResponse<Conversation>>(
      "/chat/conversation/group/participant/kick",
      {
        conversationId,
        participantId,
      }
    ),
  leaveGroupConversation: (conversationId: string) =>
    client.post("/chat/conversation/group/participant/leave", {
      id: conversationId,
    }),
  deleteGroupConversation: (conversationId: string) =>
    client.post("/chat/conversation/group/delete", { id: conversationId }),
};

export { authApi, userApi, chatApi };
