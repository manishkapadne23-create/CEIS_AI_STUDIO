import { Request } from "express";

import {
  analyzeEngineeringEvidence,
  getEngineeringEvidenceAuditLogs,
  getEngineeringEvidenceConfig,
} from "../services/evidence.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const getEvidenceConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEngineeringEvidenceConfig());
});

export const analyzeEvidenceController = asyncHandler(async (req: Request, res) => {
  const userMessage = req.body.userMessage ?? req.body.message;
  const aiResponse = req.body.aiResponse;

  if (!userMessage || !aiResponse) {
    return sendError(
      res,
      400,
      "EVIDENCE_INVALID_INPUT",
      "userMessage and aiResponse are required."
    );
  }

  const result = await analyzeEngineeringEvidence({
    userMessage,
    conversationId: req.body.conversationId ?? null,
    aiResponse,
    orchestration: req.body.orchestration,
    actorId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  });

  sendSuccess(res, result, {
    meta: {
      trustLevel: result.trust.level,
      citationCount: result.citations.length,
      conflictCount: result.conflicts.length,
    },
  });
});

export const listEvidenceAuditLogsController = asyncHandler(
  async (req: Request, res) => {
    const logs = await getEngineeringEvidenceAuditLogs({
      conversationId:
        typeof req.query.conversationId === "string"
          ? req.query.conversationId
          : undefined,
      actorId:
        typeof req.query.actorId === "string" ? req.query.actorId : undefined,
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
