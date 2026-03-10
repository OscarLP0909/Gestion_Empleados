import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

export const validateObjectId = (paramName: string = "id") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];
        
        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ 
                message: `${paramName} must be a non-empty string` 
            });
            return;
        }
        
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ 
                message: `Invalid ${paramName} format` 
            });
            return;
        }
        
        next();
    };
};