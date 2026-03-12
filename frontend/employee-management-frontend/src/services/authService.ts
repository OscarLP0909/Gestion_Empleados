import apiClient from "./api";
import type { User, LoginResponse } from "../types/user";

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post("/auth/login", { email, password });
        
        // El backend devuelve el usuario directamente con el token
        // Restructurar a LoginResponse esperado
        const data = response.data;
        
        return {
            access_token: data.token || data.access_token || "",
            user: {
                _id: data._id,
                id: data._id,
                email: data.email,
                role: data.role,
                name: data.name || "",
                isActive: data.isActive !== false,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        };
    },

    register: async (data: {
        name: string;
        email: string;
        password: string;
    }): Promise<LoginResponse> => {
        const response = await apiClient.post("/auth/register", data);
        const responseData = response.data;
        
        return {
            access_token: responseData.token || responseData.access_token || "",
            user: {
                _id: responseData._id,
                id: responseData._id,
                email: responseData.email,
                role: responseData.role,
                name: responseData.name || "",
                isActive: responseData.isActive !== false,
                createdAt: responseData.createdAt,
                updatedAt: responseData.updatedAt,
            },
        };
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem("token");
    },

    getProfile: async (): Promise<User> => {
        const response = await apiClient.get("/auth/profile");
        return response.data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await apiClient.patch("/auth/profile", data);
        return response.data;
    },

    changePassword: async (data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{ message: string }> => {
        const response = await apiClient.post("/auth/change-password", data);
        return response.data;
    },
};