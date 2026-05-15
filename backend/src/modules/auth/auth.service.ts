import bcrypt from "bcryptjs";
import { User, type UserDocument } from "../user/user.model.js";
import { ApiError } from "../../utils/api-error.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import type { LoginDto, RegisterDto } from "./auth.dto.js";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResult = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export async function registerUser(payload: RegisterDto): Promise<AuthResult> {
  const existingUser = await User.exists({ email: payload.email });

  if (existingUser) {
    throw ApiError.conflict("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
  });

  return rotateAuthTokens(user);
}

export async function loginUser(payload: LoginDto): Promise<AuthResult> {
  const user = await User.findOne({ email: payload.email }).select("+passwordHash");

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  return rotateAuthTokens(user);
}

export async function refreshSession(refreshToken: string): Promise<AuthResult> {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.userId).select("+refreshTokenHash");

  if (!user || !user.refreshTokenHash) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const tokenMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);

  if (!tokenMatches) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  return rotateAuthTokens(user);
}

export async function logoutUser(userId: string | undefined) {
  if (!userId) return;

  await User.findByIdAndUpdate(userId, {
    $set: { refreshTokenHash: null },
  });
}

export async function logoutSession(refreshToken: string | null) {
  if (!refreshToken) return;

  try {
    const payload = verifyRefreshToken(refreshToken);
    await logoutUser(payload.userId);
  } catch {
    return;
  }
}

async function rotateAuthTokens(user: UserDocument): Promise<AuthResult> {
  const authUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  const accessToken = signAccessToken({ userId: authUser.id });
  const refreshToken = signRefreshToken(authUser.id);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  await user.save();

  return {
    user: authUser,
    accessToken,
    refreshToken,
  };
}
