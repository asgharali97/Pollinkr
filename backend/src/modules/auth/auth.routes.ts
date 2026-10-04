import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validate-request.js";
import {
  login,
  logout,
  me,
  refresh,
  register,
  resendVerification,
  verifyEmail,
} from "./auth.controller.js";
import {
  loginDto,
  registerDto,
  resendVerificationDto,
  verifyEmailDto,
} from "./auth.dto.js";

export const authRoutes = Router();

authRoutes.post("/register", validateRequest({ body: registerDto }), register);
authRoutes.post("/login", validateRequest({ body: loginDto }), login);
authRoutes.post(
  "/verify-email",
  validateRequest({ body: verifyEmailDto }),
  verifyEmail,
);
authRoutes.post(
  "/resend-verification",
  validateRequest({ body: resendVerificationDto }),
  resendVerification,
);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, me);
