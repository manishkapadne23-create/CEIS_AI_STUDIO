import { Router } from "express";
import {
  createEngineeringDomainController,
  deleteEngineeringDomainController,
  getEngineeringDomainController,
  listEngineeringDomainsController,
  updateEngineeringDomainController,
} from "../controllers/engineeringDomain.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listEngineeringDomainsController);
router.get("/:id", getEngineeringDomainController);

router.use(protect);

router.post("/", authorize(["ADMIN"]), createEngineeringDomainController);
router.put("/:id", authorize(["ADMIN"]), updateEngineeringDomainController);
router.delete("/:id", authorize(["ADMIN"]), deleteEngineeringDomainController);

export default router;
