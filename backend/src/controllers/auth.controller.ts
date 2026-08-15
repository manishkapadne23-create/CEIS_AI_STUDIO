import { Request, Response } from "express";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const requestContext = (req: Request) => ({
  ipAddress: req.ip ?? null,
  userAgent: req.header("user-agent") ?? null,
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return sendError(res, 400, "VALIDATION_ERROR", "name, email, and password are required.");
  }

  const user = await registerUser(name, email, password, requestContext(req));
  sendSuccess(res, { user }, { status: 201, message: "User registered successfully." });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 400, "VALIDATION_ERROR", "email and password are required.");
  }

  const result = await loginUser(email, password, requestContext(req));
  sendSuccess(res, result, { message: "Login successful." });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return sendError(res, 400, "VALIDATION_ERROR", "refreshToken is required.");
  }

  const result = await refreshAccessToken(refreshToken, requestContext(req));
  sendSuccess(res, result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }

  await logoutUser(req.user.id, req.body.refreshToken, requestContext(req));
  sendSuccess(res, { loggedOut: true });
});
