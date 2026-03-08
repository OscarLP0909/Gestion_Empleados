import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { createContract, deleteContract, getContractById, getContracts } from "../controllers/contractController.js";

const router = Router();

router.post("/", ensureAuthenticated, createContract);
router.get("/", ensureAuthenticated, getContracts);
router.get("/contract/:id", ensureAuthenticated, getContractById);
router.delete("/contract/:id", ensureAuthenticated, deleteContract);


export default router;