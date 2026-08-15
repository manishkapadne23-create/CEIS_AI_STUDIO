import { Router } from "express";

import {
  collaborateEmaceController,
  getEmaceConfigController,
  getEmacePreferencesController,
  listEmaceAgentsController,
  listEmaceAuditLogsController,
  updateEmacePreferencesController,
} from "../controllers/emace.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/config", getEmaceConfigController);
router.get("/agents", listEmaceAgentsController);

router.get(
  "/preferences",
  protect,
  authorize(["ADMIN", "USER"]),
  getEmacePreferencesController
);

router.put(
  "/preferences",
  protect,
  authorize(["ADMIN", "USER"]),
  updateEmacePreferencesController
);

router.post(
  "/collaborate",
  protect,
  authorize(["ADMIN", "USER"]),
  collaborateEmaceController
);

router.get(
  "/audit-logs",
  protect,
  authorize(["ADMIN", "USER"]),
  listEmaceAuditLogsController
);

export default router;
