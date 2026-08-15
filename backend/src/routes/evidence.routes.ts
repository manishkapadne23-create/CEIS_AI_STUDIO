import { Router } from "express";

import {
  analyzeEvidenceController,
  getEvidenceConfigController,
  listEvidenceAuditLogsController,
} from "../controllers/evidence.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/config", getEvidenceConfigController);

router.post(
  "/analyze",
  protect,
  authorize(["ADMIN", "USER"]),
  analyzeEvidenceController
);

router.get(
  "/audit-logs",
  protect,
  authorize(["ADMIN"]),
  listEvidenceAuditLogsController
);

export default router;
