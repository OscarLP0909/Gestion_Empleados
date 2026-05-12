"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_js_1 = require("../middlewares/auth/jwt.js");
const authorization_js_1 = require("../middlewares/authorization.js");
const validation_js_1 = require("../middlewares/validation.js");
const userController_js_1 = require("../controllers/userController.js");
const router = (0, express_1.Router)();
// GET - Obtener todos los usuarios (solo ADMIN)
router.get("/", jwt_js_1.ensureAuthenticated, (0, authorization_js_1.authorizeRole)(["ADMIN"]), userController_js_1.getUsers);
// POST - Crear nuevo Usuario (solo ADMIN)
router.post("/", jwt_js_1.ensureAuthenticated, (0, authorization_js_1.authorizeRole)(["ADMIN"]), userController_js_1.createNewUser);
// PATCH - Cambiar rol de un usuario (solo ADMIN)
router.patch("/:id/role", jwt_js_1.ensureAuthenticated, (0, authorization_js_1.authorizeRole)(["ADMIN"]), (0, validation_js_1.validateObjectId)("id"), userController_js_1.updateUserRole);
// PATCH - Desactivar usuario (solo ADMIN)
router.patch("/:id/deactivate", jwt_js_1.ensureAuthenticated, (0, authorization_js_1.authorizeRole)(["ADMIN"]), (0, validation_js_1.validateObjectId)("id"), userController_js_1.deactivateUser);
// PATCH - Activar usuario (solo ADMIN)
router.patch("/:id/activate", jwt_js_1.ensureAuthenticated, (0, authorization_js_1.authorizeRole)(["ADMIN"]), (0, validation_js_1.validateObjectId)("id"), userController_js_1.activateUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map