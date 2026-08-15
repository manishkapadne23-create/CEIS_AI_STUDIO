import { NextFunction, Request, Response } from "express";

import { isProduction } from "../config/env.js";

export const httpsRedirect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!isProduction || process.env.ESIPF_HTTPS_ONLY !== "true") {
    return next();
  }

  const forwardedProto = req.header("x-forwarded-proto");
  if (forwardedProto && forwardedProto !== "https") {
    return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  }

  next();
};
