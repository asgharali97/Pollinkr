import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z.string().min(8).max(128);

export const registerDto = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const loginDto = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const verifyEmailDto = z.object({
  token: z.string().trim().min(20).max(256),
});

export const resendVerificationDto = z.object({
  email: emailSchema,
});

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
export type VerifyEmailDto = z.infer<typeof verifyEmailDto>;
export type ResendVerificationDto = z.infer<typeof resendVerificationDto>;
