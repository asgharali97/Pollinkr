import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env.js";

const ACCESS_TOKEN_COOKIE = "pollinkr_access";
const REFRESH_TOKEN_COOKIE = "pollinkr_refresh";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) {
  res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, baseCookieOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, baseCookieOptions);
}

export function getAccessTokenFromRequest(req: Request) {
  return readCookie(req, ACCESS_TOKEN_COOKIE);
}

export function getRefreshTokenFromRequest(req: Request) {
  return readCookie(req, REFRESH_TOKEN_COOKIE);
}

function readCookie(req: Request, name: string) {
  const header = req.headers.cookie;
  if (!header) return null;

  const cookies = header.split(";").map((cookie) => cookie.trim());
  const target = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  if (!target) return null;

  return decodeURIComponent(target.slice(name.length + 1));
}
