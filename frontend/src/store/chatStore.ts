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

  sendMessage: (conversationId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
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

  sendMessage: async (conversationId, content) => {
    const response = await chatApi.sendMessage({ conversationId, content });

    const { success, data } = response.data;

    if (success) {
      set((state) => ({
        messages: [...state.messages, data],
        conversations: state.conversations.map((conversation) => {
          if (conversation.id === conversationId) {
            return {
              ...conversation,
              lastActivity: new Date(),
              preview: data.displayContent,
            };
          }

          return conversation;
        }),
      }));
    }
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
}));
