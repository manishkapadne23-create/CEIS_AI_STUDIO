import { Router } from "express";

import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", loginRateLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

export default router;
