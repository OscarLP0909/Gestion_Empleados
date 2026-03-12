import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { localStrategy } from "../middlewares/auth/local.js";
import { jwtStrategy, withToken } from "../middlewares/auth/jwt.js";
import { User } from "../db/models/user.js";

passport.use(localStrategy.name, localStrategy.strategy);
passport.use(jwtStrategy.name, jwtStrategy.strategy);

export const login = (req: Request, res: Response, next: NextFunction) => {
    console.log("LOGIN BODY: ", req.body);
    passport.authenticate(
        localStrategy.name,
        { session: false },
        (err: any, user?: Express.User | false | null) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: "Wrong credentials" });
            }
            // ✅ ACTUALIZADO: withToken ahora incluye el role automáticamente
            return res.status(200).json(withToken(user as any));
        }
    )(req, res, next);
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, role } = req.body;

        // Validar campos requeridos
        if (!email || !password || !name) {
            res.status(400).json({
                message: "Email, nombre y contraseña son requeridos"
            });
            return;
        }

        // Validar que el email no exista
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        }

        // Crear usuario
        const newUser = new User({
            email,
            password,
            name,
            role: role || "EMPLOYEE",  // Agregar rol, por defecto EMPLOYEE
            isActive: true,
        });

        await newUser.save();

        res.status(201).json({
            message: "Usuario registrado correctamente",
            user: {
                _id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                isActive: newUser.isActive,
            },
        });
    } catch (error) {
        next(error);
    }
};
/**
 * GET /auth/profile
 * Obtener perfil del usuario logueado
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?._id).select("-password");
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /auth/profile
 * Actualizar información del perfil
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;

        if (!name && !email) {
            res.status(400).json({ message: "Debe enviar al menos un campo a actualizar" });
            return;
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { ...(name && { name }), ...(email && { email }) },
            { new: true }
        ).select("-password");

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /auth/change-password
 * Cambiar contraseña del usuario
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Se requieren ambas contraseñas" });
            return;
        }

        // ← IMPORTANTE: Seleccionar el password
        const user = await User.findById(req.user?._id).select("+password");
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        // Verificar contraseña actual
        const isPasswordValid = await (user as any).comparePassword(currentPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Contraseña actual incorrecta" });
            return;
        }

        // Cambiar contraseña
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error en changePassword:", error);
        next(error);
    }
};