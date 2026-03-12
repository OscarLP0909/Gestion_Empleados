import { create } from "zustand";
import type { User } from "../types/user";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user: User | null) => {
        if (user) {
            set({
                user,
                isAuthenticated: true,
            });
        } else {
            set({
                user: null,
                isAuthenticated: false,
            });
        }
    },

    logout: () => {
        console.log("🔓 Limpiando store...");
        localStorage.removeItem("token");
        set({
            user: null,
            isAuthenticated: false,
        });
    },
}));