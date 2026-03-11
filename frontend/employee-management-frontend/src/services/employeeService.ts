import apiClient from "./api";
import type { Employee, CreateEmployeeInput } from "../types/employee";

export const employeeService = {
    getAll: async (): Promise<Employee[]> => {
    const response = await apiClient.get("/employee");
    return response.data.map((emp: any) => ({
        ...emp,
        id: emp.id || emp._id, 
    }));
},

    getById: async (id: string): Promise<Employee> => {
    console.log("getById called with ID:", id);
    const response = await apiClient.get(`/employee/${id}`);
    console.log("Response from getById:", response.data);
    return response.data;
},

    create: async (data: CreateEmployeeInput): Promise<Employee> => {
        const response = await apiClient.post("/employee", data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateEmployeeInput>): Promise<Employee> => {
        const response = await apiClient.put(`/employee/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        return await apiClient.delete(`/employee/${id}`);
    },
};