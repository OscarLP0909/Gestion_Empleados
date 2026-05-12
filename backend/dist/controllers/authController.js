"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.register = exports.login = void 0;
const passport_1 = __importDefault(require("passport"));
const local_js_1 = require("../middlewares/auth/local.js");
const jwt_js_1 = require("../middlewares/auth/jwt.js");
const user_js_1 = require("../db/models/user.js");
passport_1.default.use(local_js_1.localStrategy.name, local_js_1.localStrategy.strategy);
passport_1.default.use(jwt_js_1.jwtStrategy.name, jwt_js_1.jwtStrategy.strategy);
const login = (req, res, next) => {
    console.log("LOGIN BODY: ", req.body);
    passport_1.default.authenticate(local_js_1.localStrategy.name, { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "Wrong credentials" });
        }
        // ✅ ACTUALIZADO: withToken ahora incluye el role automáticamente
        return res.status(200).json((0, jwt_js_1.withToken)(user));
    })(req, res, next);
};
exports.login = login;
const register = async (req, res, next) => {
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
        const existingUser = await user_js_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        }
        // Crear usuario
        const newUser = new user_js_1.User({
            email,
            password,
            name,
            role: role || "EMPLOYEE", // Agregar rol, por defecto EMPLOYEE
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * GET /auth/profile
 * Obtener perfil del usuario logueado
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await user_js_1.User.findById(req.user?._id).select("-password");
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
/**
 * PATCH /auth/profile
 * Actualizar información del perfil
 */
const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        if (!name && !email) {
            res.status(400).json({ message: "Debe enviar al menos un campo a actualizar" });
            return;
        }
        const user = await user_js_1.User.findByIdAndUpdate(req.user?._id, { ...(name && { name }), ...(email && { email }) }, { new: true }).select("-password");
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
/**
 * PATCH /auth/change-password
 * Cambiar contraseña del usuario
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "Se requieren ambas contraseñas" });
            return;
        }
        // ← IMPORTANTE: Seleccionar el password
        const user = await user_js_1.User.findById(req.user?._id).select("+password");
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        // Verificar contraseña actual
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Contraseña actual incorrecta" });
            return;
        }
        // Cambiar contraseña
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    }
    catch (error) {
        console.error("Error en changePassword:", error);
        next(error);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=authController.js.map