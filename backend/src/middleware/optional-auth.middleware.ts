import type { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model.js";
import { getAccessTokenFromRequest } from "../utils/cookies.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = getAccessTokenFromRequest(req);
  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId).select("_id name email");
    if (user) {
      req.user = {
        id: user._id.toString(),
        _id: user._id,
        name: user.name,
        email: user.email,
      };
    }
  } catch {

  }

  next();
}
