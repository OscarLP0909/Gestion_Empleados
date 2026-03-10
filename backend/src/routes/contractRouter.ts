import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { createContract, deleteContract, getContractActiveOfEmployee, getContractById, getContracts, getContractsOfEmployee, updateContract, updateStatus } from "../controllers/contractController.js";

const router = Router();

router.post("/", ensureAuthenticated, createContract);
router.get("/", ensureAuthenticated, getContracts);
router.put("/:id", ensureAuthenticated, updateContract);
router.get("/:id", ensureAuthenticated, getContractById);
router.delete("/:id", ensureAuthenticated, deleteContract);
router.patch("/status/:id", ensureAuthenticated, updateStatus);
router.get("/employee/active/:employeeId", ensureAuthenticated, getContractActiveOfEmployee);
router.get("/employee/:employeeId", ensureAuthenticated, getContractsOfEmployee);


export default router;