import { NextFunction, Request, Response } from "express";

import { config } from "../config/index.js";
import { AuthenticationError } from "../utils/AppError.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const isCsrfEnabled = (): boolean => process.env.ESIPF_CSRF_ENABLED === "true";

const allowedOrigins = (): string[] => {
  const origin = config.cors.origin;
  return Array.isArray(origin) ? origin : [origin];
};

export const csrfProtection = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!isCsrfEnabled() || SAFE_METHODS.has(req.method)) {
    return next();
  }

  const origin = req.header("origin");
  const referer = req.header("referer");
  const allowed = allowedOrigins();

  const originAllowed =
    (origin && allowed.some((entry) => origin.startsWith(entry))) ||
    (referer && allowed.some((entry) => referer.startsWith(entry)));

  if (!originAllowed) {
    return next(new AuthenticationError("CSRF origin validation failed."));
  }

  next();
};
