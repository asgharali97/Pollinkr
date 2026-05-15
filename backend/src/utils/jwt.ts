import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

type AccessTokenPayload = {
  userId: string;
};

type RefreshTokenPayload = {
  userId: string;
  tokenVersion: "refresh";
};

export function signAccessToken(payload: AccessTokenPayload) {
  const expiresIn = env.JWT_ACCESS_EXPIRES_IN as NonNullable<
    SignOptions["expiresIn"]
  >;
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(userId: string) {
  const expiresIn = env.JWT_REFRESH_EXPIRES_IN as NonNullable<
    SignOptions["expiresIn"]
  >;
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign({ userId, tokenVersion: "refresh" }, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;

  if (payload.tokenVersion !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  return payload;
}
