import { NextFunction, Request, Response } from "express";

import { isProduction } from "../config/index.js";
import { errorLogger } from "../infrastructure/logger/index.js";
import { sendError } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, "NOT_FOUND", `Route ${req.method} ${req.path} not found.`);
};

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  errorLogger.error(err.message, {
    path: req.path,
    method: req.method,
    stack: isProduction ? undefined : err.stack,
    code: err instanceof AppError ? err.code : "INTERNAL_ERROR",
  });

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  const message = isProduction
    ? "An unexpected error occurred. Please try again later."
    : err.message;

  sendError(res, 500, "INTERNAL_ERROR", message);
};
