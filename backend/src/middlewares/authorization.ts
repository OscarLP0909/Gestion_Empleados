import type { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface User {
            _id: string;
            email: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
        }
    }
}

export const authorizeRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as any;

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
        } catch (error) {
            res.status(500).json({ message: "Authorization error" });
        }
    };
};

export const isHROrAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
};