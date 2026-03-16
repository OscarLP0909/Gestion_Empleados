import type { NextFunction, Request, Response } from "express";
import { User } from "../db/models/user.js";
import { createAuditLog } from "../services/auditService.js";
import { Types } from "mongoose";
import bcrypt from "bcrypt";

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
 * 
 * POST /users
 * Agregar usuarios que tendrán acceso a la APP
 * Body: { email, password, role }
 */

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            res.status(400).send("All the fields are required");
            return;
        }

        if(typeof(email) !== "string" || email === "") {
            res.sendStatus(400);
            return;
        }

        const user = await User.findOne({email});
        if(user) {
            res.status(400).send("User already exists");
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashPassword,
            role: role || "HR_MANAGER",
            isActive: true
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: { email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        next(error);
    }
}

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

        // ✅ Obtener usuario antes del cambio
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const oldRole = user.role;

        // ✅ Actualizar usuario
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        // ← AGREGAR AUDITORÍA
        await createAuditLog(
            (req as any).user._id.toString(),
            (req as any).user.name,
            "ROLE_CHANGE",
            "USER",
            updatedUser?._id.toString(),
            updatedUser?.name as string | undefined,
            req,
            { before: { role: oldRole }, after: { role: updatedUser?.role } },
            `Rol del usuario ${updatedUser?.name} cambió de ${oldRole} a ${updatedUser?.role}`
        );

        res.status(200).json({
            message: "User role updated successfully",
            user: updatedUser,
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

        // ✅ Obtener usuario antes del cambio
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // ✅ Desactivar usuario
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).select("-password");

        // ← AGREGAR AUDITORÍA
        await createAuditLog(
            (req as any).user._id.toString(),
            (req as any).user.name,
            "UPDATE",
            "USER",
            updatedUser?._id.toString(),
            updatedUser?.name as string | undefined,
            req,
            { before: { isActive: user.isActive }, after: { isActive: updatedUser?.isActive } },
            `Usuario ${updatedUser?.name} desactivado`
        );

        res.status(200).json({
            message: "User deactivated successfully",
            user: updatedUser,
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

        // ✅ Obtener usuario antes del cambio
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // ✅ Activar usuario
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        ).select("-password");

        // ← AGREGAR AUDITORÍA
        await createAuditLog(
            (req as any).user._id.toString(),
            (req as any).user.name,
            "UPDATE",
            "USER",
            updatedUser?._id.toString(),
            updatedUser?.name as string | undefined,
            req,
            { before: { isActive: user.isActive }, after: { isActive: updatedUser?.isActive } },
            `Usuario ${updatedUser?.name} activado`
        );

        res.status(200).json({
            message: "User activated successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};