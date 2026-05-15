import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export function notFoundHandler(req: Request, res: Response) {
  return ApiResponse.error(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ApiError) {
    return ApiResponse.error(res, error.statusCode, error.message);
  }

  const message = error instanceof Error ? error.message : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
    data: null,
    stack: env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
  });
}
