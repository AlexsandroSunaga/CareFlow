import { create } from "zustand";
import { clearToken, getToken, setToken } from "@/api/client";

type AuthState = {
  token: string | null;
  setSession: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  setSession: (token) => {
    setToken(token);
    set({ token });
  },
  logout: () => {
    clearToken();
    set({ token: null });
  },
}));
