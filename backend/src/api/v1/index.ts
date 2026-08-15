import { Router } from "express";

import authRoutes from "../../routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import pluginRoutes from "./routes/plugin.routes.js";
import governanceRoutes from "./routes/governance.routes.js";
import knowledgeBaseRoutes from "../../routes/knowledgeBase.routes.js";
import engineeringDomainRoutes from "../../routes/engineeringDomain.routes.js";
import edmRoutes from "../../routes/edm.routes.js";
import orchestratorRoutes from "../../routes/orchestrator.routes.js";
import evidenceRoutes from "../../routes/evidence.routes.js";
import predictiveRoutes from "../../routes/predictive.routes.js";
import emaceRoutes from "../../routes/emace.routes.js";
import edeRoutes from "../../routes/ede.routes.js";
import essaeRoutes from "../../routes/essae.routes.js";
import securityRoutes from "../../routes/security.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { aiRateLimiter } from "../../middleware/rateLimiter.js";

const v1Router = Router();

v1Router.use(healthRoutes);
v1Router.use("/auth", authRoutes);
v1Router.use("/ai", aiRateLimiter, aiRoutes);
v1Router.use("/plugins", pluginRoutes);
v1Router.use("/governance", governanceRoutes);
v1Router.use("/knowledge-base", knowledgeBaseRoutes);
v1Router.use("/engineering-domains", engineeringDomainRoutes);
v1Router.use("/edm", edmRoutes);
v1Router.use("/orchestrator", orchestratorRoutes);
v1Router.use("/evidence", evidenceRoutes);
v1Router.use("/predictive", predictiveRoutes);
v1Router.use("/agents", emaceRoutes);
v1Router.use("/digital-engineer", edeRoutes);
v1Router.use("/simulation", essaeRoutes);
v1Router.use("/security", securityRoutes);

export default v1Router;
