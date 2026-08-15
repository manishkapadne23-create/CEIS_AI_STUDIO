import { Router } from "express";

import {
  analyzePredictiveController,
  getPredictiveConfigController,
  getPredictivePreferencesController,
  listPredictiveInsightLogsController,
  updatePredictivePreferencesController,
} from "../controllers/predictive.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/config", getPredictiveConfigController);

router.get(
  "/preferences",
  protect,
  authorize(["ADMIN", "USER"]),
  getPredictivePreferencesController
);

router.put(
  "/preferences",
  protect,
  authorize(["ADMIN", "USER"]),
  updatePredictivePreferencesController
);

router.post(
  "/analyze",
  protect,
  authorize(["ADMIN", "USER"]),
  analyzePredictiveController
);

router.get(
  "/insight-logs",
  protect,
  authorize(["ADMIN", "USER"]),
  listPredictiveInsightLogsController
);

export default router;
