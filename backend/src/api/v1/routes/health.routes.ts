import { Router } from "express";

import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/apiResponse.js";
import { getLiveness, getReadiness, getSystemHealth } from "../../../monitoring/health.js";
import { getMetrics } from "../../../monitoring/metrics.js";
import { config } from "../../../config/index.js";

const router = Router();

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const health = await getSystemHealth();
  const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503;
    sendSuccess(res, health, { status: statusCode });
  })
);

router.get("/health/live", (_req, res) => {
  sendSuccess(res, getLiveness());
});

router.get(
  "/health/ready",
  asyncHandler(async (_req, res) => {
    const readiness = await getReadiness();
    sendSuccess(res, readiness, {
      status: readiness.ready ? 200 : 503,
    });
  })
);

router.get("/metrics", (_req, res) => {
  sendSuccess(res, {
    metrics: getMetrics(),
    environment: config.env,
    uptime: process.uptime(),
  });
});

export default router;
