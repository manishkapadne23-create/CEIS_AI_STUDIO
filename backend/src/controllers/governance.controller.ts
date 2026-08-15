import { Request, Response } from "express";

import { recordMetric } from "../monitoring/metrics.js";
import {
  bootstrapGovernance,
  getDependencyReport,
  getGovernanceReport,
  getModule,
  getQualityReport,
  getSecurityReport,
  listModules,
} from "../services/governance.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import type { ModuleCategory } from "../governance/types.js";

export const getGovernanceOverview = asyncHandler(async (_req: Request, res: Response) => {
  const start = Date.now();
  const report = await getGovernanceReport();
  recordMetric("governance.report", Date.now() - start);
  sendSuccess(res, report);
});

export const getGovernanceQuality = asyncHandler(async (_req: Request, res: Response) => {
  const quality = await getQualityReport();
  sendSuccess(res, quality);
});

export const getGovernanceDependencies = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, getDependencyReport());
});

export const getGovernanceSecurity = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, { checks: getSecurityReport() });
});

export const getGovernanceModules = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category as ModuleCategory | undefined;
  sendSuccess(res, { modules: listModules(category) });
});

export const getGovernanceModule = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const module = getModule(id);
  sendSuccess(res, { module: module ?? null });
});

export const initializeGovernanceHandler = asyncHandler(async (_req: Request, res: Response) => {
  const report = await bootstrapGovernance();
  sendSuccess(res, {
    initialized: true,
    version: report.version,
    modules: report.architecture.totalModules,
  });
});
