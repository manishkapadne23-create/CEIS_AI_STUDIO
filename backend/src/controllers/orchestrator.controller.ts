import { Request } from "express";

import {
  analyzeEngineeringRequest,
  getEngineeringOrchestratorConfig,
  getEngineeringOrchestratorHealth,
} from "../services/orchestrator.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getOrchestratorConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEngineeringOrchestratorConfig());
});

export const getOrchestratorHealthController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEngineeringOrchestratorHealth());
});

export const analyzeOrchestratorRequestController = asyncHandler(
  async (req: Request, res) => {
    const result = await analyzeEngineeringRequest({
      userMessage: req.body.userMessage ?? req.body.message ?? "",
      conversationId: req.body.conversationId ?? null,
      disciplineId: req.body.disciplineId ?? req.body.domainId ?? null,
      disciplineName: req.body.disciplineName ?? req.body.domainName ?? null,
      specializationId: req.body.specializationId ?? null,
      specializationName: req.body.specializationName ?? null,
      moduleId: req.body.moduleId ?? null,
      projectId: req.body.projectId ?? null,
      projectName: req.body.projectName ?? null,
      projectContext: req.body.projectContext ?? null,
      conversationHistory: req.body.history ?? req.body.conversationHistory,
      memorySummary: req.body.memorySummary ?? null,
      subscriptionPlan: req.body.subscriptionPlan,
      language: req.body.language,
    });

    sendSuccess(res, result, {
      meta: {
        summary: result.summaryText,
        primaryModule: result.primaryRoute?.resolvedModuleId ?? null,
        isMultiModule: result.taskPlan.isComplex,
      },
    });
  }
);
