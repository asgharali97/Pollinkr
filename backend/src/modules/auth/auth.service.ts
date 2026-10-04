import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { User, type UserDocument } from "../user/user.model.js";
import { ApiError } from "../../utils/api-error.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { sendVerificationEmail } from "../../services/email.service.js";
import type {
  LoginDto,
  RegisterDto,
  ResendVerificationDto,
  VerifyEmailDto,
} from "./auth.dto.js";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
};

type AuthResult = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

function generateVerificationToken(): {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  return { rawToken, tokenHash, expiresAt };
}

export async function registerUser(payload: RegisterDto) {
  const existingUser = await User.exists({ email: payload.email });

  if (existingUser) {
    throw ApiError.conflict("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const { rawToken, tokenHash, expiresAt } = generateVerificationToken();

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
    isEmailVerified: false,
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpiresAt: expiresAt,
  });

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    token: rawToken,
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isEmailVerified: false,
  };
}

export async function loginUser(payload: LoginDto): Promise<AuthResult> {
  const user = await User.findOne({ email: payload.email }).select(
    "+passwordHash",
  );

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw ApiError.forbidden(
      "Please verify your email address before logging in. Check your inbox for the verification link.",
    );
  }

  return rotateAuthTokens(user);
}

export async function verifyUserEmail(
  payload: VerifyEmailDto,
): Promise<AuthResult & { message: string }> {
  const tokenHash = crypto
    .createHash("sha256")
    .update(payload.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
  }).select("+emailVerificationTokenHash");

  if (!user) {
    throw ApiError.badRequest(
      "Invalid verification link. Please request a new one.",
    );
  }

  if (
    user.emailVerificationExpiresAt &&
    user.emailVerificationExpiresAt.getTime() < Date.now()
  ) {
    throw ApiError.badRequest(
      "Verification link has expired. Please request a new one.",
    );
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpiresAt = null;
  await user.save();

  // Issue session tokens immediately so the user lands in the app
  // without a separate login step after verifying their email.
  const authResult = await rotateAuthTokens(user);

  return {
    ...authResult,
    message: "Email verified successfully.",
  };
}

export async function resendVerificationEmail(
  payload: ResendVerificationDto,
): Promise<{ message: string }> {
  const user = await User.findOne({ email: payload.email }).select(
    "+emailVerificationTokenHash",
  );

  // Timing/enumeration protection: return generic message if user not found
  if (!user) {
    return {
      message:
        "If an account with that email exists, a verification link has been sent.",
    };
  }

  if (user.isEmailVerified) {
    return {
      message: "This email address is already verified. You can log in.",
    };
  }

  // Rate-limiting check (cooldown)
  if (user.emailVerificationExpiresAt) {
    const issuedAt =
      user.emailVerificationExpiresAt.getTime() - VERIFICATION_TOKEN_TTL_MS;
    const timeSinceIssue = Date.now() - issuedAt;

    if (timeSinceIssue < RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil(
        (RESEND_COOLDOWN_MS - timeSinceIssue) / 1000,
      );
      throw ApiError.badRequest(
        `Please wait ${waitSeconds} seconds before requesting another verification email.`,
      );
    }
  }

  const { rawToken, tokenHash, expiresAt } = generateVerificationToken();
  user.emailVerificationTokenHash = tokenHash;
  user.emailVerificationExpiresAt = expiresAt;
  await user.save();

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    token: rawToken,
  });

  return {
    message: "Verification link sent. Please check your inbox.",
  };
}

export async function refreshSession(
  refreshToken: string,
): Promise<AuthResult> {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.userId).select(
    "+refreshTokenHash",
  );

  if (!user || !user.refreshTokenHash) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  if (!user.isEmailVerified) {
    throw ApiError.forbidden("Email is not verified");
  }

  const tokenMatches = await bcrypt.compare(
    refreshToken,
    user.refreshTokenHash,
  );

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
    isEmailVerified: user.isEmailVerified,
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
