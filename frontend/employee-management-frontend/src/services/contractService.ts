import apiClient from "./api";
import type { Contract, CreateContractInput } from "../types/contract";

export const contractService = {
    getAll: async (): Promise<Contract[]> => {
        const response = await apiClient.get("/contract");
        console.log("Contracts response:", response.data);
        return response.data;
    },

    getById: async (id: string): Promise<Contract> => {
        const response = await apiClient.get(`/contract/${id}`);
        console.log("Contract detail:", response.data);
        return response.data;
    },

    getByEmployeeId: async (employeeId: string): Promise<Contract[]> => {
        const response = await apiClient.get(`/contract/employee/${employeeId}`);
        return response.data;
    },

    create: async (data: CreateContractInput): Promise<Contract> => {
        const response = await apiClient.post("/contract", data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateContractInput>): Promise<Contract> => {
        const response = await apiClient.put(`/contract/${id}`, data);
        return response.data;
    },

    updateStatus: async (id: string, status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO"): Promise<Contract> => {
        const response = await apiClient.patch(`/contract/${id}`, { status });
        return response.data;
    },

    delete: async (id: string) => {
        return await apiClient.delete(`/contract/${id}`);
    },
};