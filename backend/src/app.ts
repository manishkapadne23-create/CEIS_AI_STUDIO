import cors from "cors";
import express from "express";

import v1Router from "./api/v1/index.js";
import { config } from "./config/index.js";
import { initBackgroundJobs } from "./jobs/index.js";
import { initializePlugins } from "./services/plugin.service.js";
import { bootstrapGovernance } from "./services/governance.service.js";
import { appLogger } from "./infrastructure/logger/index.js";
import { initStorage } from "./infrastructure/storage/index.js";
import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { generalRateLimiter } from "./middleware/rateLimiter.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { securityHeaders } from "./middleware/security.js";
import { sanitizeBody } from "./middleware/validate.js";
import { httpsRedirect } from "./middleware/httpsRedirect.js";
import { csrfProtection } from "./middleware/csrfProtection.js";
import { esipfSecurityMiddleware } from "./middleware/esipfSecurity.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import securityRoutes from "./routes/security.routes.js";
import engineeringDomainRoutes from "./routes/engineeringDomain.routes.js";
import edmRoutes from "./routes/edm.routes.js";
import orchestratorRoutes from "./routes/orchestrator.routes.js";
import evidenceRoutes from "./routes/evidence.routes.js";
import predictiveRoutes from "./routes/predictive.routes.js";
import emaceRoutes from "./routes/emace.routes.js";
import edeRoutes from "./routes/ede.routes.js";
import essaeRoutes from "./routes/essae.routes.js";
import knowledgeBaseRoutes from "./routes/knowledgeBase.routes.js";
import { aiRateLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.set("trust proxy", 1);

app.use(httpsRedirect);
app.use(securityHeaders);
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(sanitizeBody);
app.use(csrfProtection);
app.use(esipfSecurityMiddleware);
app.use(generalRateLimiter);

initStorage();
initBackgroundJobs();
void initializePlugins().catch((error) => {
  appLogger.error("Plugin manager initialization failed", {
    error: error instanceof Error ? error.message : String(error),
  });
});
void bootstrapGovernance().catch((error) => {
  appLogger.error("Governance framework initialization failed", {
    error: error instanceof Error ? error.message : String(error),
  });
});

// Versioned API — /api/v1/*
app.use(`/api/${config.apiVersion}`, v1Router);

// Legacy routes (backward compatibility)
app.use("/auth", authRoutes);
app.use("/api/security", securityRoutes);
app.use("/api", aiRateLimiter, aiRoutes);
app.use("/api/knowledge-base", knowledgeBaseRoutes);
app.use("/api/engineering-domains", engineeringDomainRoutes);
app.use("/api/edm", edmRoutes);
app.use("/api/orchestrator", orchestratorRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/predictive", predictiveRoutes);
app.use("/api/agents", emaceRoutes);
app.use("/api/digital-engineer", edeRoutes);
app.use("/api/simulation", essaeRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Sarathi AI Backend",
    version: "1.0.0",
    api: `/api/${config.apiVersion}`,
    environment: config.env,
  });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

appLogger.info("Application configured", {
  environment: config.env,
  apiVersion: config.apiVersion,
});

export default app;
