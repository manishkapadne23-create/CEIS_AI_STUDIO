import { Request } from "express";

import {
  exportDigitalEngineerProfile,
  generateAndStoreInsights,
  getDigitalEngineerProfile,
  getEdeConfig,
  listDigitalEngineerInsights,
  recordDigitalEngineerActivity,
  resetDigitalEngineerProfile,
  updateDigitalEngineerProfile,
} from "../services/ede.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const getEdeConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEdeConfig());
});

export const getDigitalEngineerProfileController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const pkg = await getDigitalEngineerProfile(req.user.id, {
      userId: req.user.id,
      disciplineId:
        typeof req.query.disciplineId === "string" ? req.query.disciplineId : null,
      disciplineName:
        typeof req.query.disciplineName === "string"
          ? req.query.disciplineName
          : null,
    });

    sendSuccess(res, pkg);
  }
);

export const updateDigitalEngineerProfileController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const profile = await updateDigitalEngineerProfile(req.user.id, req.body);
    sendSuccess(res, { profile });
  }
);

export const resetDigitalEngineerProfileController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const profile = await resetDigitalEngineerProfile(req.user.id);
    sendSuccess(res, { profile, message: "Digital engineer profile reset." });
  }
);

export const exportDigitalEngineerProfileController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const exportPayload = await exportDigitalEngineerProfile(req.user.id);
    sendSuccess(res, exportPayload);
  }
);

export const recordEdeActivityController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const { signalType, resourceId, resourceLabel, disciplineId } = req.body;
    if (!signalType) {
      return sendError(res, 400, "EDE_INVALID_INPUT", "signalType is required.");
    }

    await recordDigitalEngineerActivity(req.user.id, {
      signalType,
      resourceId,
      resourceLabel,
      disciplineId,
    });

    sendSuccess(res, { recorded: true });
  }
);

export const generateEdeInsightsController = asyncHandler(
  async (req: Request, res) => {
    if (!req.user?.id) {
      return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const insights = await generateAndStoreInsights(req.user.id);
    sendSuccess(res, { insights });
  }
);

export const listEdeInsightsController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }

  const insights = await listDigitalEngineerInsights({
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

  sendSuccess(res, insights);
});
