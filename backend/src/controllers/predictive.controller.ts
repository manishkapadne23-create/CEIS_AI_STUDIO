import { Request } from "express";

import {
  analyzePredictiveIntelligence,
  getOrCreatePredictivePreferences,
  getPredictiveIntelligenceConfig,
  getUserPredictiveInsightLogs,
  updatePredictivePreferences,
} from "../services/predictive.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const getPredictiveConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getPredictiveIntelligenceConfig());
});

export const getPredictivePreferencesController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const preferences = await getOrCreatePredictivePreferences(req.user.id);
    sendSuccess(res, { preferences });
  }
);

export const updatePredictivePreferencesController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const allowedKeys = [
      "predictiveEnabled",
      "recommendationsEnabled",
      "timelineEnabled",
      "remindersEnabled",
      "riskPredictionEnabled",
      "learningPredictionEnabled",
      "projectAwarenessEnabled",
      "aiCoachEnabled",
      "shareBehaviorData",
    ] as const;

    const updates: Record<string, boolean> = {};
    for (const key of allowedKeys) {
      if (typeof req.body[key] === "boolean") {
        updates[key] = req.body[key];
      }
    }

    const preferences = await updatePredictivePreferences(req.user.id, updates);
    sendSuccess(res, { preferences });
  }
);

export const analyzePredictiveController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const result = await analyzePredictiveIntelligence({
      userId: req.user.id,
      disciplineId: req.body.disciplineId ?? null,
      disciplineName: req.body.disciplineName ?? null,
      specializationId: req.body.specializationId ?? null,
      specializationName: req.body.specializationName ?? null,
      projectId: req.body.projectId ?? null,
      projectName: req.body.projectName ?? null,
      recentConversations: req.body.recentConversations,
      recentDocuments: req.body.recentDocuments,
      recentStandards: req.body.recentStandards,
      recentCalculations: req.body.recentCalculations,
      recentWorkflows: req.body.recentWorkflows,
      learningProgress: req.body.learningProgress,
      lastIntent: req.body.lastIntent ?? null,
      lastTopic: req.body.lastTopic ?? null,
    });

    sendSuccess(res, result, {
      meta: {
        enabled: result.enabled,
        recommendationCount: result.recommendations.length,
        riskCount: result.risks.length,
        timelineCount: result.timeline.length,
      },
    });
  }
);

export const listPredictiveInsightLogsController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const logs = await getUserPredictiveInsightLogs({
      userId: req.user.id,
      skip:
        typeof req.query.skip === "string"
          ? Number.parseInt(req.query.skip, 10)
          : undefined,
      take:
        typeof req.query.take === "string"
          ? Number.parseInt(req.query.take, 10)
          : undefined,
    });

    sendSuccess(res, logs);
  }
);
