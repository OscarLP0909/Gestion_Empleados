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
import { validateNif } from "../middlewares/employee.js";
import { validateObjectId } from "../middlewares/validation.js";

const router = Router();


router.get("/nif/:nif", ensureAuthenticated, validateNif, getEmployeeByNif);


router.get("/", ensureAuthenticated, getEmployees);
router.post("/", ensureAuthenticated, createEmployee);
router.get("/:id", ensureAuthenticated, validateObjectId, getEmployeeById);
router.put("/:id", ensureAuthenticated, validateObjectId, updateEmployee);
router.delete("/:id", ensureAuthenticated, deleteEmployee);

export default router;