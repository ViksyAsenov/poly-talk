import { create } from "zustand";
import { Message, Conversation } from "../types/chat";
import { chatApi } from "../api/client";
import toast from "react-hot-toast";

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];

  setCurrentConversation: (conversation: Conversation | null) => void;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;

  addMessage: (conversationId: string, message: Message) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;

  changeGroupConversationName: (id: string, name: string) => Promise<void>;
  makeParticipantAdmin: (id: string, userId: string) => Promise<void>;
  addParticipant: (id: string, userId: string) => Promise<void>;
  removeParticipant: (id: string, userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  fetchConversations: async () => {
    const response = await chatApi.getConversations();

    const { success, data } = response.data;

    if (success) {
      set({ conversations: data });
    }
  },
  fetchMessages: async (conversationId) => {
    const response = await chatApi.getMessages(conversationId);

    const { success, data } = response.data;

    if (success) {
      set({ messages: data });
    }
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((conversation) => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            lastActivity: new Date(),
            preview: message.displayContent,
          };
        }

        return conversation;
      }),
    }));
  },
  sendMessage: async (conversationId, content) => {
    await chatApi.sendMessage({ conversationId, content });
  },
  deleteMessage: async (messageId) => {
    const response = await chatApi.deleteMessage(messageId);

    const { success } = response.data;

    if (success) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== messageId),
      }));

      toast.success("Message deleted successfully");
    }
  },

  changeGroupConversationName: async (id: string, name) => {
    const response = await chatApi.updateGroupConversationName(id, name);

    const { success, data } = response.data;

    if (success) {
      set({ currentConversation: data });
      set({
        conversations: get().conversations.map((c) => (c.id === id ? data : c)),
      });

      toast.success("Group name changed successfully");
    }
  },
  makeParticipantAdmin: async (id, userId) => {
    const response = await chatApi.makeParticipantAdmin(id, userId);

    const { success, data } = response.data;

    if (success) {
      set({ currentConversation: data });
      set({
        conversations: get().conversations.map((c) => (c.id === id ? data : c)),
      });

      toast.success("Participant is now an admin");
    }
  },
  addParticipant: async (id, userId) => {
    const response = await chatApi.addParticipantToGroupConversation(
      id,
      userId
    );

    const { success, data } = response.data;

    if (success) {
      set({ currentConversation: data });
      set({
        conversations: get().conversations.map((c) => (c.id === id ? data : c)),
      });

      toast.success("Participant added successfully");
    }
  },
  removeParticipant: async (id, userId) => {
    const response = await chatApi.removeParticipantFromGroupConversation(
      id,
      userId
    );

    const { success, data } = response.data;

    if (success) {
      set({ currentConversation: data });
      set({
        conversations: get().conversations.map((c) => (c.id === id ? data : c)),
      });

      toast.success("Participant removed successfully");
    }
  },
}));
