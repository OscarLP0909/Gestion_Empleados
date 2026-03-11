import { Router } from "express";
import { login, register, getProfile, updateProfile, changePassword } from "../controllers/authController.js";
import { ensureAuthenticated } from "../middlewares/auth/jwt.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", ensureAuthenticated, getProfile);
router.patch("/profile", ensureAuthenticated, updateProfile);
router.patch("/change-password", ensureAuthenticated, changePassword);


export default router;