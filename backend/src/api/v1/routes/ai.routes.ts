import { Router } from "express";



import {

  chatWithAI,

  completeAIRequest,

  getProviderHealth,

  getProviderSettings,

  streamAIRequest,

} from "../../../controllers/ai.controller.js";

import { protect, authorize } from "../../../middleware/auth.middleware.js";

import { requireFeature } from "../../../middleware/licenseEnforcement.js";



const router = Router();



router.post(

  "/chat",

  protect,

  authorize(["ADMIN", "USER"]),

  requireFeature("ai-chat-basic"),

  chatWithAI

);

router.post(

  "/complete",

  protect,

  authorize(["ADMIN", "USER"]),

  requireFeature("ai-complete"),

  completeAIRequest

);

router.post(

  "/complete/stream",

  protect,

  authorize(["ADMIN", "USER"]),

  requireFeature("ai-stream"),

  streamAIRequest

);

router.get(

  "/providers/health",

  protect,

  authorize(["ADMIN", "USER"]),

  getProviderHealth

);

router.get(

  "/providers/settings",

  protect,

  authorize(["ADMIN"]),

  getProviderSettings

);



export default router;

