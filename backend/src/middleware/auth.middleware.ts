import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config/index.js";
import { auditLogger } from "../infrastructure/logger/index.js";
import { logSecurityAudit } from "../security/auditService.js";
import { AuthenticationError, AuthorizationError } from "../utils/AppError.js";

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) return next(error);
    next(new AuthenticationError("Invalid or expired token."));
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    if (!roles.includes(req.user.role)) {
      auditLogger.info("auth.denied", {
        userId: req.user.id,
        role: req.user.role,
        requiredRoles: roles,
      });
      void logSecurityAudit({
        category: "AUTH",
        eventType: "auth.denied",
        userId: req.user.id,
        actorId: req.user.id,
        status: "denied",
        metadata: { role: req.user.role, requiredRoles: roles },
      });
      return next(new AuthorizationError());
    }

    next();
  };
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
