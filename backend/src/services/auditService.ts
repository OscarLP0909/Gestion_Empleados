import type { Request } from "express";
import { AuditLog } from "../db/models/AuditLog.js";

export const createAuditLog = async (
    userId: string,
    userName: string,
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE",
    entityType: "EMPLOYEE" | "CONTRACT" | "USER",
    entityId: string | undefined,
    entityName: string | undefined,
    req: Request,
    changes?: { before?: any; after?: any },
    description?: string
) => {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || "Unknown";
        const userAgent = req.get("user-agent") || "Unknown";

        const auditLog = new AuditLog({
            userId,
            userName,
            action,
            entityType,
            entityId,
            entityName,
            changes,
            ipAddress,
            userAgent,
            description,
        });

        await auditLog.save();
    } catch (error) {
        console.error("Error creating audit log:", error);
    }
};

export const getAuditLogs = async (
    page: number = 1,
    limit: number = 20,
    filters?: {
        userId?: string;
        action?: string;
        entityType?: string;
        startDate?: Date;
        endDate?: Date;
    }
) => {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters?.userId) query.userId = filters.userId;
    if (filters?.action) query.action = filters.action;
    if (filters?.entityType) query.entityType = filters.entityType;

    if (filters?.startDate || filters?.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = filters.startDate;
        if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    const logs = await AuditLog.find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await AuditLog.countDocuments(query);

    return {
        logs,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};