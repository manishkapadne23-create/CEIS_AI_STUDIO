import { Router } from "express";



import {

  disablePluginHandler,

  enablePluginHandler,

  getPlugins,

  getPluginsHealth,

  installPluginHandler,

  removePluginHandler,

  rollbackPluginHandler,

} from "../../../controllers/plugin.controller.js";

import { protect, authorize } from "../../../middleware/auth.middleware.js";



const router = Router();



router.get("/", protect, authorize(["ADMIN", "USER"]), getPlugins);

router.get("/health", protect, authorize(["ADMIN"]), getPluginsHealth);

router.post("/install", protect, authorize(["ADMIN"]), installPluginHandler);

router.post("/:pluginId/enable", protect, authorize(["ADMIN"]), enablePluginHandler);

router.post("/:pluginId/disable", protect, authorize(["ADMIN"]), disablePluginHandler);

router.post("/:pluginId/rollback", protect, authorize(["ADMIN"]), rollbackPluginHandler);

router.delete("/:pluginId", protect, authorize(["ADMIN"]), removePluginHandler);



export default router;

