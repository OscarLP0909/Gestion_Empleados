import apiClient from "./api";
import type { User } from "../types/user";

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get("/user");
        return response.data;  // ← response.data YA es el array
    },

    updateRole: async (id: string, role: string): Promise<User> => {
        const response = await apiClient.patch(`/user/${id}/role`, { role });
        return response.data.user;  // ← Aquí sí está dentro de un objeto
    },

    deactivate: async (id: string): Promise<User> => {
        const response = await apiClient.patch(`/user/${id}/deactivate`);
        return response.data.user;  // ← Aquí sí está dentro de un objeto
    },

    activate: async (id: string): Promise<User> => {
        const response = await apiClient.patch(`/user/${id}/activate`);
        return response.data.user;  // ← Aquí sí está dentro de un objeto
    },

    createUser: async (data: {
        name: string;
        email: string;
        password: string;
        role: string
    }): Promise<User> => {
        const response = await apiClient.post("/auth/register", data);
        return response.data.user;
    },
};