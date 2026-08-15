import { NextFunction, Request, Response } from "express";

import { isDevelopment } from "../config/env.js";
import { userHasFeature } from "../security/licenseManager.js";
import { AuthorizationError } from "../utils/AppError.js";

export const requireFeature = (featureId: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (isDevelopment) {
      return next();
    }

    if (!req.user?.id) {
      return next(new AuthorizationError());
    }

    const allowed = await userHasFeature(req.user.id, featureId);
    if (!allowed) {
      return next(
        new AuthorizationError(
          `Feature "${featureId}" is not available on your license tier.`
        )
      );
    }

    next();
  };
};
