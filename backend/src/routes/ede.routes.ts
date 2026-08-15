import { Router } from "express";

import {
  exportDigitalEngineerProfileController,
  generateEdeInsightsController,
  getDigitalEngineerProfileController,
  getEdeConfigController,
  listEdeInsightsController,
  recordEdeActivityController,
  resetDigitalEngineerProfileController,
  updateDigitalEngineerProfileController,
} from "../controllers/ede.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/config", getEdeConfigController);

router.get(
  "/profile",
  protect,
  authorize(["ADMIN", "USER"]),
  getDigitalEngineerProfileController
);

router.put(
  "/profile",
  protect,
  authorize(["ADMIN", "USER"]),
  updateDigitalEngineerProfileController
);

router.post(
  "/profile/reset",
  protect,
  authorize(["ADMIN", "USER"]),
  resetDigitalEngineerProfileController
);

router.get(
  "/profile/export",
  protect,
  authorize(["ADMIN", "USER"]),
  exportDigitalEngineerProfileController
);

router.post(
  "/activity",
  protect,
  authorize(["ADMIN", "USER"]),
  recordEdeActivityController
);

router.post(
  "/insights/generate",
  protect,
  authorize(["ADMIN", "USER"]),
  generateEdeInsightsController
);

router.get(
  "/insights",
  protect,
  authorize(["ADMIN", "USER"]),
  listEdeInsightsController
);

export default router;
