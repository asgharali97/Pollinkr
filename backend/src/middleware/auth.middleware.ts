import type { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { getAccessTokenFromRequest } from "../utils/cookies.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getAccessTokenFromRequest(req);

    if (!token) {
      throw ApiError.unauthorized("Login is required");
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select("_id name email");

    if (!user) {
      throw ApiError.unauthorized("User no longer exists");
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
