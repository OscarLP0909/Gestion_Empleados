"use strict";
// =====================================================
// routes/contractRoutes.ts - ACTUALIZADO CON ROLES
// =====================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_js_1 = require("../middlewares/auth/jwt.js");
const authorization_js_1 = require("../middlewares/authorization.js");
const validation_js_1 = require("../middlewares/validation.js");
const contractController_js_1 = require("../controllers/contractController.js");
const router = (0, express_1.Router)();
// ✅ Rutas públicas (solo autenticación, cualquier rol)
router.get("/employee/active/:employeeId", jwt_js_1.ensureAuthenticated, (0, validation_js_1.validateObjectId)("employeeId"), contractController_js_1.getContractActiveOfEmployee);
router.get("/employee/:employeeId", jwt_js_1.ensureAuthenticated, (0, validation_js_1.validateObjectId)("employeeId"), contractController_js_1.getContractsOfEmployee);
// ✅ Lectura de contratos (todos los roles autenticados)
router.get("/", jwt_js_1.ensureAuthenticated, contractController_js_1.getContracts);
// Obtener contratos PENDIENTES (debe ir antes de /:id)
router.get("/pending", jwt_js_1.ensureAuthenticated, authorization_js_1.isHROrAdmin, contractController_js_1.getContractsPending);
router.get("/:id", jwt_js_1.ensureAuthenticated, (0, validation_js_1.validateObjectId)("id"), contractController_js_1.getContractById);
// ✅ Crear contrato (solo HR_MANAGER o ADMIN)
router.post("/", jwt_js_1.ensureAuthenticated, authorization_js_1.isHROrAdmin, contractController_js_1.createContract);
// ✅ Actualizar contrato (solo HR_MANAGER o ADMIN)
router.put("/:id", jwt_js_1.ensureAuthenticated, authorization_js_1.isHROrAdmin, (0, validation_js_1.validateObjectId)("id"), contractController_js_1.updateContract);
// ✅ Cambiar status (solo HR_MANAGER o ADMIN)
router.patch("/:id", jwt_js_1.ensureAuthenticated, authorization_js_1.isHROrAdmin, (0, validation_js_1.validateObjectId)("id"), contractController_js_1.updateStatus);
// ✅ Eliminar contrato (solo ADMIN)
router.delete("/:id", jwt_js_1.ensureAuthenticated, authorization_js_1.isAdmin, (0, validation_js_1.validateObjectId)("id"), contractController_js_1.deleteContract);
exports.default = router;
//# sourceMappingURL=contractRouter.js.map