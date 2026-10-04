import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url(),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(8),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1),
  FINGERPRINT_SECRET: z.string().min(8),
  RESEND_API_KEY: z.string().default(""),
  RESEND_FROM_EMAIL: z.string().default(""),
}).superRefine((values, context) => {
  if (values.NODE_ENV !== "production") return;

  if (!values.RESEND_API_KEY) {
    context.addIssue({
      code: "custom",
      path: ["RESEND_API_KEY"],
      message: "RESEND_API_KEY is required in production",
    });
  }

  if (!values.RESEND_FROM_EMAIL) {
    context.addIssue({
      code: "custom",
      path: ["RESEND_FROM_EMAIL"],
      message: "RESEND_FROM_EMAIL is required in production",
    });
  }
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables", z.treeifyError(parsedEnv.error));
  process.exit(1);
}

export const env = parsedEnv.data;
