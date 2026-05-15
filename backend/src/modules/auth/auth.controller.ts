import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response.js";
import {
  clearAuthCookies,
  getRefreshTokenFromRequest,
  setAuthCookies,
} from "../../utils/cookies.js";
import { ApiError } from "../../utils/api-error.js";
import {
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
} from "./auth.service.js";
import type { LoginDto, RegisterDto } from "./auth.dto.js";

export async function register(req: Request, res: Response) {
  const result = await registerUser(req.body as RegisterDto);
  setAuthCookies(res, result);

  return ApiResponse.created(res, "Account created successfully", {
    user: result.user,
  });
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body as LoginDto);
  setAuthCookies(res, result);

  return ApiResponse.ok(res, "Logged in successfully", {
    user: result.user,
  });
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }

  const result = await refreshSession(refreshToken);
  setAuthCookies(res, result);

  return ApiResponse.ok(res, "Session refreshed successfully", {
    user: result.user,
  });
}

export async function logout(req: Request, res: Response) {
  await logoutSession(getRefreshTokenFromRequest(req));
  clearAuthCookies(res);

  return ApiResponse.ok(res, "Logged out successfully");
}

export async function me(req: Request, res: Response) {
  return ApiResponse.ok(res, "Authenticated user fetched successfully", {
    user: req.user,
  });
}
