import apiClient from "./api";
import type { AuditLogsResponse } from "../types/audit";

export const auditService = {
    getLogs: async (
        page: number = 1,
        limit: number = 20,
        filters?: {
            userId?: string;
            action?: string;
            entityType?: string;
            startDate?: string;
            endDate?: string;
        }
    ): Promise<AuditLogsResponse> => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (filters?.userId) params.append("userId", filters.userId);
        if (filters?.action) params.append("action", filters.action);
        if (filters?.entityType) params.append("entityType", filters.entityType);
        if (filters?.startDate) params.append("startDate", filters.startDate);
        if (filters?.endDate) params.append("endDate", filters.endDate);

        const response = await apiClient.get(`/audit/logs?${params}`);
        return response.data;
    },
};