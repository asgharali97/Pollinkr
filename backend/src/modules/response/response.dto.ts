import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const submitResponseDto = z.object({
  answers: z
    .array(
      z.object({
        questionId: objectIdSchema,
        optionId: objectIdSchema,
      })
    )
    .min(1)
    .max(50)
    .refine(
      (answers) =>
        new Set(answers.map((answer) => answer.questionId)).size === answers.length,
      "A question can only be answered once"
    ),
});

export type SubmitResponseDto = z.infer<typeof submitResponseDto>;
