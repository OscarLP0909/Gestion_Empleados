"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.createAuditLog = void 0;
const AuditLog_js_1 = require("../db/models/AuditLog.js");
const createAuditLog = async (userId, userName, action, entityType, entityId, entityName, req, changes, description) => {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || "Unknown";
        const userAgent = req.get("user-agent") || "Unknown";
        const auditLog = new AuditLog_js_1.AuditLog({
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
    }
    catch (error) {
        console.error("Error creating audit log:", error);
    }
};
exports.createAuditLog = createAuditLog;
const getAuditLogs = async (page = 1, limit = 20, filters) => {
    const skip = (page - 1) * limit;
    const query = {};
    if (filters?.userId)
        query.userId = filters.userId;
    if (filters?.action)
        query.action = filters.action;
    if (filters?.entityType)
        query.entityType = filters.entityType;
    if (filters?.startDate || filters?.endDate) {
        query.createdAt = {};
        if (filters.startDate)
            query.createdAt.$gte = filters.startDate;
        if (filters.endDate)
            query.createdAt.$lte = filters.endDate;
    }
    const logs = await AuditLog_js_1.AuditLog.find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await AuditLog_js_1.AuditLog.countDocuments(query);
    return {
        logs,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};
exports.getAuditLogs = getAuditLogs;
//# sourceMappingURL=auditService.js.map