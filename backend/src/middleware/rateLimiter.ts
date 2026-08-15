import { NextFunction, Request, Response } from "express";

import { config } from "../config/index.js";
import { RateLimitError } from "../utils/AppError.js";

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

const checkLimit = (key: string, max: number): boolean => {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + config.rateLimit.windowMs });
    return true;
  }

  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
};

const clientKey = (req: Request): string =>
  req.ip ?? req.socket.remoteAddress ?? "unknown";

export const generalRateLimiter = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!checkLimit(`general:${clientKey(req)}`, config.rateLimit.maxRequests)) {
    return next(new RateLimitError());
  }
  next();
};

export const aiRateLimiter = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!checkLimit(`ai:${clientKey(req)}`, config.rateLimit.aiMaxRequests)) {
    return next(new RateLimitError("AI request limit exceeded. Please wait before retrying."));
  }
  next();
};

export const loginRateLimiter = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const email =
    typeof req.body?.email === "string" ? req.body.email.toLowerCase() : "unknown";
  const maxAttempts = Number(process.env.LOGIN_RATE_LIMIT_MAX ?? 10);
  if (!checkLimit(`login:${clientKey(req)}:${email}`, maxAttempts)) {
    return next(new RateLimitError("Too many login attempts. Please try again later."));
  }
  next();
};

export const clearRateLimitBuckets = (): void => {
  buckets.clear();
};
