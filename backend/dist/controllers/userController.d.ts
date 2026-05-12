import type { NextFunction, Request, Response } from "express";
/**
 * GET /api/users
 * Obtener todos los usuarios (sin mostrar contraseñas)
 * Requiere: ADMIN
 */
export declare const getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 *
 * POST /users
 * Agregar usuarios que tendrán acceso a la APP
 * Body: { email, password, role }
 */
export declare const createNewUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /api/users/:id/role
 * Cambiar el rol de un usuario
 * Requiere: ADMIN
 * Body: { role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE" }
 */
export declare const updateUserRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /api/users/:id/deactivate
 * Desactivar un usuario (no elimina, solo marca como inactivo)
 * Requiere: ADMIN
 */
export declare const deactivateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PATCH /api/users/:id/activate
 * Reactivar un usuario
 * Requiere: ADMIN
 */
export declare const activateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map