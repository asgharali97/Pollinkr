import { z } from "zod";
import { RESPONSE_MODES } from "../../types/poll.types.js";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const trimmedText = (max: number) => z.string().trim().min(1).max(max);

const optionDto = z.object({
  text: trimmedText(300),
});

const questionDto = z.object({
  text: trimmedText(500),
  mandatory: z.boolean().default(true),
  options: z.array(optionDto).min(2).max(12),
});

const expiresAtSchema = z
  .string()
  .datetime()
  .transform((value) => new Date(value))
  .refine((value) => value.getTime() > Date.now(), {
    message: "Expiry date must be in the future",
  });

export const createPollDto = z.object({
  title: trimmedText(160),
  description: z.string().trim().max(1200).optional().default(""),
  responseMode: z.enum(RESPONSE_MODES).default("authenticated"),
  expiresAt: expiresAtSchema.optional().nullable(),
  questions: z.array(questionDto).min(1).max(50),
  publish: z.boolean().default(false),
});

export const updatePollDto = z.object({
  title: trimmedText(160).optional(),
  description: z.string().trim().max(1200).optional(),
  responseMode: z.enum(RESPONSE_MODES).optional(),
  expiresAt: expiresAtSchema.optional().nullable(),
  questions: z.array(questionDto).min(1).max(50).optional(),
});

export const pollIdParamsDto = z.object({
  id: objectIdSchema,
});

export const shareIdParamsDto = z.object({
  shareId: z.string().trim().min(6).max(64),
});

export type CreatePollDto = z.infer<typeof createPollDto>;
export type UpdatePollDto = z.infer<typeof updatePollDto>;
export type PollIdParamsDto = z.infer<typeof pollIdParamsDto>;
export type ShareIdParamsDto = z.infer<typeof shareIdParamsDto>;
