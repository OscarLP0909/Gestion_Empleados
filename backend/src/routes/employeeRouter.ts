import { Router } from "express";
import { createEmployee, deleteEmployee, getEmployeeById, getEmployeeByNif, getEmployees, updateEmployee } from "../controllers/employeeController.js";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { validateNif } from "../middlewares/employee.js";

const router = Router();

router.get("/", ensureAuthenticated, getEmployees);
router.post("/", ensureAuthenticated, createEmployee);
router.get("/id/:id", ensureAuthenticated, getEmployeeById);
router.get("/nif/:nif", ensureAuthenticated, validateNif, getEmployeeByNif);
router.put("/:id", ensureAuthenticated, updateEmployee);
router.delete("/:id", ensureAuthenticated, deleteEmployee);

export default router;