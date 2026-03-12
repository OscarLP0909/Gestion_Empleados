export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface AuditLog {
    _id: string;
    userId: User;
    userName: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    entityId: string;
    entityName: string;
    changes?: {
        before?: any;
        after?: any;
    };
    ipAddress: string;
    userAgent: string;
    description: string;
    createdAt: string;
}

export interface AuditLogsResponse {
    logs: AuditLog[];
    total: number;
    page: number;
    pages: number;
}