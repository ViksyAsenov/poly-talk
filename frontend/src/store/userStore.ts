import { create } from "zustand";
import { authApi, userApi } from "../api/client";
import { IFriendRequests, IMinUser, Language } from "../types/user";
import toast from "react-hot-toast";

interface UserState {
  user: IMinUser | null;
  isAuthenticated: boolean;
  friends: IMinUser[];
  pendingFriendRequests: IFriendRequests;
  languages: Language[];

  updateUser: (
    displayName?: string,
    firstName?: string,
    lastName?: string,
    languageId?: string
  ) => Promise<void>;

  fetchFriends: () => Promise<void>;
  fetchPendingFriendRequests: () => Promise<void>;

  sendFriendRequest: (tag: string) => Promise<void>;
  acceptFriendRequest: (id: string) => Promise<void>;
  rejectFriendRequest: (id: string) => Promise<void>;
  removeFriend: (id: string) => Promise<void>;

  fetchLanguages: () => Promise<void>;

  checkAuth: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  friends: [],
  pendingFriendRequests: { sent: [], received: [] },
  languages: [],

  updateUser: async (displayName, firstName, lastName, languageId) => {
    const response = await userApi.updateMe(
      displayName,
      firstName,
      lastName,
      languageId
    );

    const { success, data } = response.data;

    if (success) {
      set({ user: data });
      toast.success("Profile updated successfully");
    }
  },

  fetchFriends: async () => {
    const response = await userApi.getFriends();
    const { success, data } = response.data;

    if (success) {
      set({ friends: data });
    }
  },
  fetchPendingFriendRequests: async () => {
    const response = await userApi.getPendingFriendRequests();
    const { success, data } = response.data;

    if (success) {
      set({ pendingFriendRequests: data });
    }
  },

  sendFriendRequest: async (tag) => {
    const response = await userApi.sendFriendRequest(tag);
    const { success } = response.data;

    if (success) {
      await get().fetchFriends();
      await get().fetchPendingFriendRequests();

      toast.success("Friend request sent successfully");
    }
  },
  acceptFriendRequest: async (id) => {
    const response = await userApi.acceptFriendRequest(id);
    const { success } = response.data;

    if (success) {
      await get().fetchFriends();
      await get().fetchPendingFriendRequests();

      toast.success("Friend request accepted successfully");
    }
  },
  rejectFriendRequest: async (id) => {
    const response = await userApi.rejectFriendRequest(id);
    const { success } = response.data;

    if (success) {
      await get().fetchFriends();
      await get().fetchPendingFriendRequests();

      toast.success("Friend request rejected successfully");
    }
  },
  removeFriend: async (id) => {
    const response = await userApi.removeFriend(id);
    const { success } = response.data;

    if (success) {
      await get().fetchFriends();
      await get().fetchPendingFriendRequests();

      toast.success("Friend removed successfully");
    }
  },

  fetchLanguages: async () => {
    const response = await userApi.getLanguages();
    const { success, data } = response.data;

    if (success) {
      set({ languages: data });
    }
  },

  checkAuth: async () => {
    const { data } = await userApi.getMe();

    if (data.success) {
      set({ user: data.data, isAuthenticated: true });
    }
  },
  loginWithGoogle: async () => {
    const response = await authApi.getGoogleLoginUrl();
    const { success, data } = response.data;

    if (success) {
      window.location.href = data;
    }
  },
}));

export { useUserStore };
