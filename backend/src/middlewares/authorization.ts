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

export const authorizeRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: This action requires one of these roles: ${allowedRoles.join(", ")}`,
            });
        }

        next();
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