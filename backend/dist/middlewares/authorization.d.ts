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
export declare const authorizeRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const isHROrAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authorization.d.ts.map