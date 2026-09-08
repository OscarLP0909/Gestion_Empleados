import { Router } from "express";
import {
    createEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeeByNif,
    getEmployees,
    updateEmployee
} from "../controllers/employeeController.js";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { isAdmin, isHROrAdmin } from "../middlewares/authorization.js";
import { validateNif } from "../middlewares/employee.js";

const router = Router();


router.get("/nif/:nif", ensureAuthenticated, validateNif, getEmployeeByNif);

router.get("/", ensureAuthenticated, isHROrAdmin, getEmployees);
router.post("/", ensureAuthenticated, isHROrAdmin, createEmployee);
router.get("/:id", ensureAuthenticated, isHROrAdmin, getEmployeeById);
router.put("/:id", ensureAuthenticated, isHROrAdmin, updateEmployee);
router.delete("/:id", ensureAuthenticated, isAdmin, deleteEmployee);

export default router;