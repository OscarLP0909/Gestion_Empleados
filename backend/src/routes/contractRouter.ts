// =====================================================
// routes/contractRoutes.ts - ACTUALIZADO CON ROLES
// =====================================================

import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { authorizeRole, isHROrAdmin, isAdmin } from "../middlewares/authorization.js";
import { validateObjectId } from "../middlewares/validation.js";
import {
    createContract,
    deleteContract,
    getContractActiveOfEmployee,
    getContractById,
    getContracts,
    getContractsOfEmployee,
    getContractsPending,
    updateContract,
    updateStatus,
} from "../controllers/contractController.js";

const router = Router();

// ✅ Rutas públicas (solo autenticación, cualquier rol)
router.get(
    "/employee/active/:employeeId",
    ensureAuthenticated,
    validateObjectId("employeeId"),
    getContractActiveOfEmployee
);

router.get(
    "/employee/:employeeId",
    ensureAuthenticated,
    validateObjectId("employeeId"),
    getContractsOfEmployee
);

// ✅ Lectura de contratos (todos los roles autenticados)
router.get("/", ensureAuthenticated, getContracts);
router.get(
    "/:id",
    ensureAuthenticated,
    validateObjectId("id"),
    getContractById
);

// Obtener contratos PENDIENTES
router.get("/pending", ensureAuthenticated, authorizeRole("ADMIN"), authorizeRole("HR_MANAGER"), getContractsPending);

// ✅ Crear contrato (solo HR_MANAGER o ADMIN)
router.post(
    "/",
    ensureAuthenticated,
    isHROrAdmin,
    createContract
);

// ✅ Actualizar contrato (solo HR_MANAGER o ADMIN)
router.put(
    "/:id",
    ensureAuthenticated,
    isHROrAdmin,
    validateObjectId("id"),
    updateContract
);

// ✅ Cambiar status (solo HR_MANAGER o ADMIN)
router.patch(
    "/:id",
    ensureAuthenticated,
    isHROrAdmin,
    validateObjectId("id"),
    updateStatus
);

// ✅ Eliminar contrato (solo ADMIN)
router.delete(
    "/:id",
    ensureAuthenticated,
    isAdmin,
    validateObjectId("id"),
    deleteContract
);

export default router;

