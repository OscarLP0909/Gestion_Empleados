import express from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { authorizeRole } from "../middlewares/authorization.js";
import { getAuditLogs } from "../services/auditService.js";

const router = express.Router();

// Usar ensureAuthenticated de Passport
router.get(
    "/logs",
    ensureAuthenticated,
    authorizeRole(["ADMIN", "HR_MANAGER"]),
    async (req, res, next) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const userId = req.query.userId as string;
            const action = req.query.action as string;
            const entityType = req.query.entityType as string;
            const startDate = req.query.startDate
                ? new Date(req.query.startDate as string)
                : undefined;
            const endDate = req.query.endDate
                ? new Date(req.query.endDate as string)
                : undefined;

            const filters: Record<string, any> = {};
            if (userId) filters.userId = userId;
            if (action) filters.action = action;
            if (entityType) filters.entityType = entityType;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const result = await getAuditLogs(page, limit, filters);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;