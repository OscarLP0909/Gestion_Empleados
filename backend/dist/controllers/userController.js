"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateUser = exports.deactivateUser = exports.updateUserRole = exports.createNewUser = exports.getUsers = void 0;
const user_js_1 = require("../db/models/user.js");
const auditService_js_1 = require("../services/auditService.js");
/**
 * GET /api/users
 * Obtener todos los usuarios (sin mostrar contraseñas)
 * Requiere: ADMIN
 */
const getUsers = async (req, res, next) => {
    try {
        const users = await user_js_1.User.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
/**
 *
 * POST /users
 * Agregar usuarios que tendrán acceso a la APP
 * Body: { email, password, role }
 */
const createNewUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).send("All the fields are required");
            return;
        }
        if (typeof (email) !== "string" || email === "") {
            res.sendStatus(400);
            return;
        }
        const user = await user_js_1.User.findOne({ email });
        if (user) {
            res.status(400).send("User already exists");
            return;
        }
        const newUser = new user_js_1.User({
            name,
            email,
            password: password,
            role: role || "HR_MANAGER",
            isActive: true
        });
        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: { email: newUser.email, role: newUser.role }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createNewUser = createNewUser;
/**
 * PATCH /api/users/:id/role
 * Cambiar el rol de un usuario
 * Requiere: ADMIN
 * Body: { role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE" }
 */
const updateUserRole = async (req, res, next) => {
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
        const user = await user_js_1.User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const oldRole = user.role;
        // ✅ Actualizar usuario
        const updatedUser = await user_js_1.User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "ROLE_CHANGE", "USER", updatedUser?._id.toString(), updatedUser?.name, req, { before: { role: oldRole }, after: { role: updatedUser?.role } }, `Rol del usuario ${updatedUser?.name} cambió de ${oldRole} a ${updatedUser?.role}`);
        res.status(200).json({
            message: "User role updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
/**
 * PATCH /api/users/:id/deactivate
 * Desactivar un usuario (no elimina, solo marca como inactivo)
 * Requiere: ADMIN
 */
const deactivateUser = async (req, res, next) => {
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
        const user = await user_js_1.User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // ✅ Desactivar usuario
        const updatedUser = await user_js_1.User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "UPDATE", "USER", updatedUser?._id.toString(), updatedUser?.name, req, { before: { isActive: user.isActive }, after: { isActive: updatedUser?.isActive } }, `Usuario ${updatedUser?.name} desactivado`);
        res.status(200).json({
            message: "User deactivated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deactivateUser = deactivateUser;
/**
 * PATCH /api/users/:id/activate
 * Reactivar un usuario
 * Requiere: ADMIN
 */
const activateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        // ✅ Obtener usuario antes del cambio
        const user = await user_js_1.User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // ✅ Activar usuario
        const updatedUser = await user_js_1.User.findByIdAndUpdate(id, { isActive: true }, { new: true }).select("-password");
        // ← AGREGAR AUDITORÍA
        await (0, auditService_js_1.createAuditLog)(req.user._id.toString(), req.user.name, "UPDATE", "USER", updatedUser?._id.toString(), updatedUser?.name, req, { before: { isActive: user.isActive }, after: { isActive: updatedUser?.isActive } }, `Usuario ${updatedUser?.name} activado`);
        res.status(200).json({
            message: "User activated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.activateUser = activateUser;
//# sourceMappingURL=userController.js.map