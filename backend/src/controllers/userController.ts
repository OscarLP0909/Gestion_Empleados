// =====================================================
// controllers/userController.ts - NUEVO
// =====================================================

import type { NextFunction, Request, Response } from "express";
import { User } from "../db/models/user.js";
import { Types } from "mongoose";

/**
 * GET /api/users
 * Obtener todos los usuarios (sin mostrar contraseñas)
 * Requiere: ADMIN
 */
export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/users/:id/role
 * Cambiar el rol de un usuario
 * Requiere: ADMIN
 * Body: { role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE" }
 */
export const updateUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // ✅ Validar que role es válido
        const validRoles = ["ADMIN", "HR_MANAGER", "MANAGER", "EMPLOYEE"];
        if (!role || !validRoles.includes(role)) {
            res.status(400).json({
                message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
            });
            return;
        }

        // ✅ Actualizar usuario
        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            message: "User role updated successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/users/:id/deactivate
 * Desactivar un usuario (no elimina, solo marca como inactivo)
 * Requiere: ADMIN
 */
export const deactivateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // ✅ Evitar que el admin se desactive a sí mismo
        if (req.user && req.user._id.toString() === id) {
            res.status(400).json({
                message: "Cannot deactivate your own account",
            });
            return;
        }

        // ✅ Desactivar usuario
        const user = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            message: "User deactivated successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/users/:id/activate
 * Reactivar un usuario
 * Requiere: ADMIN
 */
export const activateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // ✅ Activar usuario
        const user = await User.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        ).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            message: "User activated successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};