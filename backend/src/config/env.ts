import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z
    .string()
    .min(1)
    .default(
      "mongodb://pollinkr:pollinkr_dev_password@localhost:27017/pollinkr?authSource=admin"
    ),
  JWT_ACCESS_SECRET: z.string().min(32).default("fd5d1959-4674-4b23-b24b-4588e4a53065"),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default("7d"),
  FINGERPRINT_SECRET: z
    .string()
    .min(32)
    .default("bb345277-30fc-4811-8382-1f3277f4a97f"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables", z.treeifyError(parsedEnv.error));
  process.exit(1);
}

export const env = parsedEnv.data;
