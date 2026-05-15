import type { NextFunction, Request, Response } from "express";
import { z, type ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export function validateRequest(schemas: RequestSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.validated = {};

    const bodyResult = schemas.body?.safeParse(req.body);
    if (bodyResult && !bodyResult.success) {
      return sendValidationError(res, bodyResult.error);
    }
    if (bodyResult) {
      req.body = bodyResult.data;
      req.validated.body = bodyResult.data;
    }

    const paramsResult = schemas.params?.safeParse(req.params);
    if (paramsResult && !paramsResult.success) {
      return sendValidationError(res, paramsResult.error);
    }
    if (paramsResult) req.validated.params = paramsResult.data;

    const queryResult = schemas.query?.safeParse(req.query);
    if (queryResult && !queryResult.success) {
      return sendValidationError(res, queryResult.error);
    }
    if (queryResult) req.validated.query = queryResult.data;

    return next();
  };
}

function sendValidationError(res: Response, error: z.ZodError) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: z.treeifyError(error),
  });
}
