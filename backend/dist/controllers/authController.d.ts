import type { NextFunction, Request, Response } from "express";
export declare const login: (req: Request, res: Response, next: NextFunction) => void;
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /auth/profile
 * Obtener perfil del usuario logueado
 */
export declare const getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /auth/profile
 * Actualizar información del perfil
 */
export declare const updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /auth/change-password
 * Cambiar contraseña del usuario
 */
export declare const changePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map