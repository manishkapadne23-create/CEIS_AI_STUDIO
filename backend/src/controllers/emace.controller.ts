import { Request } from "express";

import {
  collaborateEngineeringRequest,
  getEmaceAuditLogs,
  getEmaceConfig,
  getOrCreateEmacePreferences,
  listEmaceAgents,
  updateEmacePreferences,
} from "../services/emace.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const getEmaceConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEmaceConfig());
});

export const listEmaceAgentsController = asyncHandler(async (_req, res) => {
  sendSuccess(res, { agents: listEmaceAgents() });
});

export const getEmacePreferencesController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const preferences = await getOrCreateEmacePreferences(req.user.id);
    sendSuccess(res, { preferences });
  }
);

export const updateEmacePreferencesController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const allowedKeys = [
      "multiAgentEnabled",
      "manualMode",
      "enabledAgentIds",
      "disabledAgentIds",
      "subscriptionPlan",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const preferences = await updateEmacePreferences(req.user.id, updates);
    sendSuccess(res, { preferences });
  }
);

export const collaborateEmaceController = asyncHandler(
  async (req: Request, res) => {
    const userMessage = req.body.userMessage ?? req.body.message;

    if (!userMessage || typeof userMessage !== "string") {
      return sendError(
        res,
        400,
        "EMACE_INVALID_INPUT",
        "userMessage is required."
      );
    }

    const result = await collaborateEngineeringRequest({
      userMessage,
      userId: req.user?.id ?? null,
      conversationId: req.body.conversationId ?? null,
      disciplineId: req.body.disciplineId ?? null,
      disciplineName: req.body.disciplineName ?? null,
      specializationId: req.body.specializationId ?? null,
      specializationName: req.body.specializationName ?? null,
      primaryIntent: req.body.primaryIntent ?? null,
      subscriptionPlan: req.body.subscriptionPlan ?? null,
      manualAgentIds: Array.isArray(req.body.manualAgentIds)
        ? req.body.manualAgentIds
        : null,
      auditContext: {
        ipAddress: req.ip,
        userAgent: req.get("user-agent") ?? undefined,
      },
    });

    sendSuccess(res, result, {
      meta: {
        enabled: result.enabled,
        agentCount: result.agentOutputs.length,
        conflictCount: result.conflicts.length,
        collaborationCount: result.collaborations.length,
      },
    });
  }
);

export const listEmaceAuditLogsController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const logs = await getEmaceAuditLogs({
      userId: req.user.id,
      conversationId:
        typeof req.query.conversationId === "string"
          ? req.query.conversationId
          : undefined,
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
