import type { NextFunction, Request, Response } from "express";
export declare const createContract: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getContracts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getContractById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteContract: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getContractsOfEmployee: (req: Request<{
    employeeId?: string | string[];
}>, res: Response, next: NextFunction) => Promise<void>;
export declare const getContractActiveOfEmployee: (req: Request<{
    employeeId?: string | string[];
}>, res: Response, next: NextFunction) => Promise<void>;
export declare const updateContract: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getContractsPending: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=contractController.d.ts.map