import { NextFunction, Request, Response } from "express";

import {
  inspectRequestSecurity,
  isRequestSigningEnabled,
  recordSuspiciousRequest,
  verifyRequestSignature,
} from "../security/index.js";
import { AuthenticationError } from "../utils/AppError.js";

export const esipfSecurityMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const inspection = inspectRequestSecurity(
    req.headers as Record<string, unknown>
  );

  if (inspection.tamperDetected) {
    await recordSuspiciousRequest({
      reason: "Tamper/debug headers detected",
      ipAddress: req.ip,
      userId: req.user?.id,
      path: req.originalUrl,
    });
    return next(new AuthenticationError("Request rejected by security policy."));
  }

  if (isRequestSigningEnabled() && !verifyRequestSignature(req)) {
    await recordSuspiciousRequest({
      reason: "Invalid request signature",
      ipAddress: req.ip,
      userId: req.user?.id,
      path: req.originalUrl,
    });
    return next(new AuthenticationError("Invalid request signature."));
  }

  next();
};
