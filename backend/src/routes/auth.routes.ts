import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

/**
 * Register User
 * POST /auth/register
 */
router.post("/register", register);

/**
 * Login User
 * POST /auth/login
 */
router.post("/login", login);

export default router;