import { Router } from "express";
import {
  createEngineeringDomainController,
  deleteEngineeringDomainController,
  getEngineeringDomainController,
  listEngineeringDomainsController,
  updateEngineeringDomainController,
} from "../controllers/engineeringDomain.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/", listEngineeringDomainsController);
router.get("/:id", getEngineeringDomainController);

router.use(protect);

router.post("/", authorize(["ADMIN"]), createEngineeringDomainController);
router.put("/:id", authorize(["ADMIN"]), updateEngineeringDomainController);
router.delete("/:id", authorize(["ADMIN"]), deleteEngineeringDomainController);

export default router;
