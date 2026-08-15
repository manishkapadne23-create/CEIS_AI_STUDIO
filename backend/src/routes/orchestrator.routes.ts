import { Router } from "express";

import {
  analyzeOrchestratorRequestController,
  getOrchestratorConfigController,
  getOrchestratorHealthController,
} from "../controllers/orchestrator.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/config", getOrchestratorConfigController);
router.get("/health", getOrchestratorHealthController);

router.post(
  "/analyze",
  protect,
  authorize(["ADMIN", "USER"]),
  (req, _res, next) => {
    if (!req.body.userMessage && req.body.message) {
      req.body.userMessage = req.body.message;
    }
    next();
  },
  validateBody(["userMessage"]),
  analyzeOrchestratorRequestController
);

export default router;
