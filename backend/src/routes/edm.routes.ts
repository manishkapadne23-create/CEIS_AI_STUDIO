import { Router } from "express";

import {
  createEdmEntryController,
  deleteEdmEntryController,
  getEdmConfigController,
  getEdmEmbeddingController,
  getEdmEntryController,
  globalSearchEdmController,
  listEdmAuditLogsController,
  listEdmEntriesController,
  registerEdmEmbeddingController,
  semanticSearchEdmController,
  updateEdmEntryController,
} from "../controllers/edm.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/config", getEdmConfigController);

router.get("/search", protect, authorize(["ADMIN", "USER"]), globalSearchEdmController);
router.post(
  "/search/semantic",
  protect,
  authorize(["ADMIN", "USER"]),
  semanticSearchEdmController
);

router.get("/entries", protect, authorize(["ADMIN", "USER"]), listEdmEntriesController);
router.get("/entries/:id", protect, authorize(["ADMIN", "USER"]), getEdmEntryController);
router.post(
  "/entries",
  protect,
  authorize(["ADMIN"]),
  validateBody(["title", "disciplineId", "categoryId"]),
  createEdmEntryController
);
router.put("/entries/:id", protect, authorize(["ADMIN"]), updateEdmEntryController);
router.delete("/entries/:id", protect, authorize(["ADMIN"]), deleteEdmEntryController);

router.get(
  "/entries/:id/embedding",
  protect,
  authorize(["ADMIN", "USER"]),
  getEdmEmbeddingController
);
router.post(
  "/entries/:id/embedding",
  protect,
  authorize(["ADMIN"]),
  registerEdmEmbeddingController
);

router.get("/audit-logs", protect, authorize(["ADMIN"]), listEdmAuditLogsController);

export default router;
