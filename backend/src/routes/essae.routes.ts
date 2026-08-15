import { Router } from "express";

import {
  analyzeAssistantController,
  compareScenariosController,
  createScenarioController,
  createWorkspaceController,
  duplicateScenarioController,
  exportScenarioController,
  getComparisonController,
  getDefaultScenarioController,
  getEssaeConfigController,
  getScenarioController,
  getWorkspaceController,
  listComparisonsController,
  listWorkspacesController,
  runAdHocSimulationController,
  runScenarioController,
  updateScenarioController,
  updateWorkspaceController,
} from "../controllers/essae.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/config", getEssaeConfigController);
router.get("/scenarios/default", getDefaultScenarioController);
router.post("/run", runAdHocSimulationController);
router.post("/assistant/analyze", analyzeAssistantController);

router.get(
  "/workspaces",
  protect,
  authorize(["ADMIN", "USER"]),
  listWorkspacesController
);

router.post(
  "/workspaces",
  protect,
  authorize(["ADMIN", "USER"]),
  createWorkspaceController
);

router.get(
  "/workspaces/:workspaceId",
  protect,
  authorize(["ADMIN", "USER"]),
  getWorkspaceController
);

router.put(
  "/workspaces/:workspaceId",
  protect,
  authorize(["ADMIN", "USER"]),
  updateWorkspaceController
);

router.post(
  "/workspaces/:workspaceId/scenarios",
  protect,
  authorize(["ADMIN", "USER"]),
  createScenarioController
);

router.get(
  "/scenarios/:scenarioId",
  protect,
  authorize(["ADMIN", "USER"]),
  getScenarioController
);

router.put(
  "/scenarios/:scenarioId",
  protect,
  authorize(["ADMIN", "USER"]),
  updateScenarioController
);

router.post(
  "/scenarios/:scenarioId/duplicate",
  protect,
  authorize(["ADMIN", "USER"]),
  duplicateScenarioController
);

router.post(
  "/scenarios/:scenarioId/run",
  protect,
  authorize(["ADMIN", "USER"]),
  runScenarioController
);

router.get(
  "/scenarios/:scenarioId/export",
  protect,
  authorize(["ADMIN", "USER"]),
  exportScenarioController
);

router.post(
  "/compare",
  protect,
  authorize(["ADMIN", "USER"]),
  compareScenariosController
);

router.get(
  "/comparisons",
  protect,
  authorize(["ADMIN", "USER"]),
  listComparisonsController
);

router.get(
  "/comparisons/:comparisonId",
  protect,
  authorize(["ADMIN", "USER"]),
  getComparisonController
);

export default router;
