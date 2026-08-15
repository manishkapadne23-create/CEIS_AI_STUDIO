import { Router } from "express";



import {

  getGovernanceDependencies,

  getGovernanceModule,

  getGovernanceModules,

  getGovernanceOverview,

  getGovernanceQuality,

  getGovernanceSecurity,

  initializeGovernanceHandler,

} from "../../../controllers/governance.controller.js";

import { protect, authorize } from "../../../middleware/auth.middleware.js";



const router = Router();



router.get("/", protect, authorize(["ADMIN", "USER"]), getGovernanceOverview);

router.post("/initialize", protect, authorize(["ADMIN"]), initializeGovernanceHandler);

router.get("/quality", protect, authorize(["ADMIN", "USER"]), getGovernanceQuality);

router.get("/dependencies", protect, authorize(["ADMIN", "USER"]), getGovernanceDependencies);

router.get("/security", protect, authorize(["ADMIN", "USER"]), getGovernanceSecurity);

router.get("/modules", protect, authorize(["ADMIN", "USER"]), getGovernanceModules);

router.get("/modules/:id", protect, authorize(["ADMIN", "USER"]), getGovernanceModule);



export default router;

