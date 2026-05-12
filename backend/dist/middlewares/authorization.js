"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isHROrAdmin = exports.authorizeRole = void 0;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            // ✅ Verificar que el role esté en allowedRoles
            if (!allowedRoles.includes(user.role)) {
                res.status(403).json({
                    message: `Access denied. Required roles: ${allowedRoles.join(", ")}. Your role: ${user.role}`
                });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: "Authorization error" });
        }
    };
};
exports.authorizeRole = authorizeRole;
const isHROrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!["ADMIN", "HR_MANAGER"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Forbidden: HR Manager or Admin access required",
        });
    }
    next();
};
exports.isHROrAdmin = isHROrAdmin;
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=authorization.js.map