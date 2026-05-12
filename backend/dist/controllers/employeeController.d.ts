import type { NextFunction, Request, Response } from "express";
export declare const createEmployee: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEmployees: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getEmployeeById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEmployeeByNif: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateEmployee: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteEmployee: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=employeeController.d.ts.map