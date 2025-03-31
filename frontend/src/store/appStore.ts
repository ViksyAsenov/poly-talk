import { create } from "zustand";

interface AppState {
  isMobileView: boolean;

  setIsMobileView: (isMobile: boolean) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  isMobileView: false,

  setIsMobileView: (isMobile: boolean) => {
    set({ isMobileView: isMobile });
  },
}));

export { useAppStore };
