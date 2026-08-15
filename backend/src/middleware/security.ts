import { NextFunction, Request, Response } from "express";

import { config } from "../config/index.js";

export const securityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; frame-ancestors 'none'"
  );
  if (config.env === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  res.removeHeader("X-Powered-By");
  next();
};
