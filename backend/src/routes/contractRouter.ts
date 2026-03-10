import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { 
    createContract, 
    deleteContract, 
    getContractActiveOfEmployee, 
    getContractById, 
    getContracts, 
    getContractsOfEmployee, 
    updateContract, 
    updateStatus 
} from "../controllers/contractController.js";
import { validateObjectId } from "../middlewares/validation.js";

const router = Router();


router.get("/employee/active/:employeeId", ensureAuthenticated, getContractActiveOfEmployee);
router.get("/employee/:employeeId", ensureAuthenticated, getContractsOfEmployee);


router.post("/", ensureAuthenticated, validateObjectId, createContract);
router.get("/", ensureAuthenticated, validateObjectId, getContracts);
router.get("/:id", ensureAuthenticated, validateObjectId, getContractById);
router.put("/:id", ensureAuthenticated, validateObjectId, updateContract);
router.delete("/:id", ensureAuthenticated, validateObjectId, deleteContract);
router.patch("/status/:id", ensureAuthenticated, validateObjectId, updateStatus);

export default router;