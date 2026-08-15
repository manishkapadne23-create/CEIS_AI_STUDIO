import { Response } from "express";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  options?: { status?: number; message?: string; meta?: Record<string, unknown> }
): Response => {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(options?.message ? { message: options.message } : {}),
    ...(options?.meta ? { meta: options.meta } : {}),
  };
  return res.status(options?.status ?? 200).json(body);
};

export const sendError = (
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown
): Response => {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return res.status(status).json(body);
};
