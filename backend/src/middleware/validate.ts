import { NextFunction, Request, Response } from "express";

import { ValidationError } from "../utils/AppError.js";

export const sanitizeOutput = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

export const sanitizeBody = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    if (body && typeof body === "object" && "error" in body) {
      const errBody = body as { error?: { message?: string } };
      if (errBody.error?.message) {
        errBody.error.message = sanitizeOutput(errBody.error.message);
      }
    }
    return originalJson(body);
  };
  next();
};

export const validateBody =
  (requiredFields: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const missing = requiredFields.filter(
      (field) =>
        req.body[field] === undefined ||
        req.body[field] === null ||
        (typeof req.body[field] === "string" && !req.body[field].trim())
    );
    if (missing.length > 0) {
      return next(
        new ValidationError(`Missing required fields: ${missing.join(", ")}`)
      );
    }
    next();
  };
