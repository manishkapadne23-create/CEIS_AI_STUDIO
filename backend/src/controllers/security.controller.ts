import { Request } from "express";

import {
  changeUserLicense,
  getBackupConfig,
  getEsipfConfig,
  getSecurityStatus,
  getUserLicense,
  queryAuditLogs,
  querySecurityEvents,
  runBackup,
  validateBackup,
} from "../services/security.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const getEsipfConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEsipfConfig());
});

export const getSecurityStatusController = asyncHandler(async (req: Request, res) => {
  const status = await getSecurityStatus(req.user?.id);
  sendSuccess(res, status);
});

export const getLicenseController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const license = await getUserLicense(req.user.id);
  sendSuccess(res, license);
});

export const updateLicenseController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  if (!req.body.tier) {
    return sendError(res, 400, "ESIPF_INVALID_INPUT", "tier is required.");
  }
  const license = await changeUserLicense(req.user.id, req.body);
  sendSuccess(res, license);
});

export const listAuditLogsController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const logs = await queryAuditLogs({
    userId: req.user.role === "ADMIN" ? undefined : req.user.id,
    limit: Number(req.query.limit ?? 100),
  });
  sendSuccess(res, logs);
});

export const listSecurityEventsController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const events = await querySecurityEvents({
    resolved: req.query.resolved === "true" ? true : undefined,
    limit: Number(req.query.limit ?? 100),
  });
  sendSuccess(res, events);
});

export const runBackupController = asyncHandler(async (req: Request, res) => {
  const result = await runBackup();
  sendSuccess(res, result);
});

export const getBackupPolicyController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getBackupConfig());
});

export const validateBackupController = asyncHandler(async (req: Request, res) => {
  if (!req.body.filePath) {
    return sendError(res, 400, "ESIPF_INVALID_INPUT", "filePath is required.");
  }
  const valid = await validateBackup(req.body.filePath);
  sendSuccess(res, { valid });
});
