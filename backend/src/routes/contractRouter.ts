import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { createContract, getContractById, getContracts } from "../controllers/contractController.js";

const router = Router();

router.post("/", ensureAuthenticated, createContract);
router.get("/", ensureAuthenticated, getContracts);
router.get("/contract/:id", ensureAuthenticated, getContractById);


export default router;