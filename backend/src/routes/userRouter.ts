import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { isAdmin } from "../middlewares/authorization.js";
import { validateObjectId } from "../middlewares/validation.js";
import {
    getUsers,
    updateUserRole,
    deactivateUser,
    activateUser,
} from "../controllers/userController.js";

const router = Router();

// Todas estas rutas requieren ser ADMIN
router.use(ensureAuthenticated, isAdmin);

// GET - Obtener todos los usuarios
router.get("/", getUsers);

// PATCH - Cambiar rol de un usuario
router.patch(
    "/:id/role",
    validateObjectId("id"),
    updateUserRole
);

// PATCH - Desactivar usuario
router.patch(
    "/:id/deactivate",
    validateObjectId("id"),
    deactivateUser
);

// PATCH - Activar usuario
router.patch(
    "/:id/activate",
    validateObjectId("id"),
    activateUser
);

export default router;