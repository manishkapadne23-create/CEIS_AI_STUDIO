import { NextFunction, Request, Response } from "express";

import { apiLogger } from "../infrastructure/logger/index.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    apiLogger.info("HTTP request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
      ip: req.ip,
      userId: req.user?.id,
    });
  });

  next();
};
