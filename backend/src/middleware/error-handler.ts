import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const message = error instanceof Error ? error.message : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
    stack: env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
  });
}
