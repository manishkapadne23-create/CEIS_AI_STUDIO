import { Router } from "express";

import {
  getBackupPolicyController,
  getEsipfConfigController,
  getLicenseController,
  getSecurityStatusController,
  listAuditLogsController,
  listSecurityEventsController,
  runBackupController,
  updateLicenseController,
  validateBackupController,
} from "../controllers/security.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/config", getEsipfConfigController);
router.get("/status", protect, authorize(["ADMIN", "USER"]), getSecurityStatusController);
router.get("/license", protect, authorize(["ADMIN", "USER"]), getLicenseController);
router.put("/license", protect, authorize(["ADMIN", "USER"]), updateLicenseController);
router.get("/audit-logs", protect, authorize(["ADMIN", "USER"]), listAuditLogsController);
router.get(
  "/events",
  protect,
  authorize(["ADMIN"]),
  listSecurityEventsController
);
router.get("/backup/policy", protect, authorize(["ADMIN"]), getBackupPolicyController);
router.post("/backup/run", protect, authorize(["ADMIN"]), runBackupController);
router.post("/backup/validate", protect, authorize(["ADMIN"]), validateBackupController);

export default router;
