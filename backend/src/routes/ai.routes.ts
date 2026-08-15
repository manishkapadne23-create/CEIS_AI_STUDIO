import { Router } from "express";



import { chatWithAILegacy } from "../controllers/ai.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

import { requireFeature } from "../middleware/licenseEnforcement.js";



const router = Router();



/** Legacy route — POST /api/chat */

router.post(

  "/chat",

  protect,

  authorize(["ADMIN", "USER"]),

  requireFeature("ai-chat-basic"),

  chatWithAILegacy

);



export default router;

