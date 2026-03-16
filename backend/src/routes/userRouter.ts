import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { authorizeRole } from "../middlewares/authorization.js";
import { validateObjectId } from "../middlewares/validation.js";
import {
    getUsers,
    updateUserRole,
    deactivateUser,
    activateUser,
    createNewUser,
} from "../controllers/userController.js";

const router = Router();

// GET - Obtener todos los usuarios (solo ADMIN)
router.get(
    "/",
    ensureAuthenticated,
    authorizeRole(["ADMIN"]),
    getUsers
);

// POST - Crear nuevo Usuario (solo ADMIN)
router.post(
    "/",
    ensureAuthenticated,
    authorizeRole(["ADMIN"]),
    createNewUser
);

// PATCH - Cambiar rol de un usuario (solo ADMIN)
router.patch(
    "/:id/role",
    ensureAuthenticated,
    authorizeRole(["ADMIN"]),
    validateObjectId("id"),
    updateUserRole
);

// PATCH - Desactivar usuario (solo ADMIN)
router.patch(
    "/:id/deactivate",
    ensureAuthenticated,
    authorizeRole(["ADMIN"]),
    validateObjectId("id"),
    deactivateUser
);

// PATCH - Activar usuario (solo ADMIN)
router.patch(
    "/:id/activate",
    ensureAuthenticated,
    authorizeRole(["ADMIN"]),
    validateObjectId("id"),
    activateUser
);

export default router;