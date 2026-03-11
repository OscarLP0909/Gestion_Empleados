import apiClient from "./api";
import type { User } from "../types/user";

export const profileService = {
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get("/auth/profile");
        return response.data;
    },

    updateProfile: async (data: { name?: string; email?: string }): Promise<User> => {
        const response = await apiClient.patch("/auth/profile", data);
        return response.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
        const response = await apiClient.patch("/auth/change-password", {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};