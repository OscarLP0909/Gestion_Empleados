"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_js_1 = require("../controllers/authController.js");
const jwt_js_1 = require("../middlewares/auth/jwt.js");
const router = (0, express_1.Router)();
router.post("/login", authController_js_1.login);
router.post("/register", authController_js_1.register);
router.get("/profile", jwt_js_1.ensureAuthenticated, authController_js_1.getProfile);
router.patch("/profile", jwt_js_1.ensureAuthenticated, authController_js_1.updateProfile);
router.patch("/change-password", jwt_js_1.ensureAuthenticated, authController_js_1.changePassword);
exports.default = router;
//# sourceMappingURL=authRouter.js.map