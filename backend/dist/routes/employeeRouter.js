"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeController_js_1 = require("../controllers/employeeController.js");
const jwt_js_1 = require("../middlewares/auth/jwt.js");
const employee_js_1 = require("../middlewares/employee.js");
const router = (0, express_1.Router)();
router.get("/nif/:nif", jwt_js_1.ensureAuthenticated, employee_js_1.validateNif, employeeController_js_1.getEmployeeByNif);
router.get("/", jwt_js_1.ensureAuthenticated, employeeController_js_1.getEmployees);
router.post("/", jwt_js_1.ensureAuthenticated, employeeController_js_1.createEmployee);
router.get("/:id", jwt_js_1.ensureAuthenticated, employeeController_js_1.getEmployeeById);
router.put("/:id", jwt_js_1.ensureAuthenticated, employeeController_js_1.updateEmployee);
router.delete("/:id", jwt_js_1.ensureAuthenticated, employeeController_js_1.deleteEmployee);
exports.default = router;
//# sourceMappingURL=employeeRouter.js.map