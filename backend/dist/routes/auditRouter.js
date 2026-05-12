"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_js_1 = require("../middlewares/auth/jwt.js");
const authorization_js_1 = require("../middlewares/authorization.js");
const auditService_js_1 = require("../services/auditService.js");
const router = express_1.default.Router();
// Usar ensureAuthenticated de Passport
router.get("/logs", jwt_js_1.ensureAuthenticated, (0, authorization_js_1.authorizeRole)(["ADMIN", "HR_MANAGER"]), async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const userId = req.query.userId;
        const action = req.query.action;
        const entityType = req.query.entityType;
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : undefined;
        const endDate = req.query.endDate
            ? new Date(req.query.endDate)
            : undefined;
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (action)
            filters.action = action;
        if (entityType)
            filters.entityType = entityType;
        if (startDate)
            filters.startDate = startDate;
        if (endDate)
            filters.endDate = endDate;
        const result = await (0, auditService_js_1.getAuditLogs)(page, limit, filters);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auditRouter.js.map