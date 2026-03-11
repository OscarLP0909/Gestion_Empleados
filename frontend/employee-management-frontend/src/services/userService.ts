import apiClient from "./api";
import type { User } from "../types/user";

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get("/user");
        return response.data;
    },

    updateRole: async (id: string, role: string): Promise<User> => {
        const response = await apiClient.patch(`/user/${id}/role`, { role });
        return response.data.user;
    },

    deactivate: async (id: string): Promise<User> => {
        const response = await apiClient.patch(`/user/${id}/deactivate`);
        return response.data.user;
    },

    activate: async (id: string): Promise<User> => {
        const response = await apiClient.patch(`/user/${id}/activate`);
        return response.data.user;
    },
};