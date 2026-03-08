import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";
import { createContract, getContracts } from "../controllers/contractController.js";

const router = Router();

router.post("/", ensureAuthenticated, createContract);
router.get("/", ensureAuthenticated, getContracts);


export default router;