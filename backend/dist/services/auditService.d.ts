import type { Request } from "express";
export declare const createAuditLog: (userId: string, userName: string, action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE", entityType: "EMPLOYEE" | "CONTRACT" | "USER", entityId: string | undefined, entityName: string | undefined, req: Request, changes?: {
    before?: any;
    after?: any;
}, description?: string) => Promise<void>;
export declare const getAuditLogs: (page?: number, limit?: number, filters?: {
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
}) => Promise<{
    logs: ({
        createdAt: NativeDate;
        userId: import("mongoose").Types.ObjectId;
        action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
        entityType: "EMPLOYEE" | "CONTRACT" | "USER";
        description?: string | null;
        userName?: string | null;
        entityId?: import("mongoose").Types.ObjectId | null;
        entityName?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
        changes?: {
            before?: any;
            after?: any;
        } | null;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[];
    total: number;
    page: number;
    pages: number;
}>;
//# sourceMappingURL=auditService.d.ts.map