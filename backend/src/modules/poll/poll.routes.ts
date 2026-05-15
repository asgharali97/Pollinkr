import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { optionalAuth } from "../../middleware/optional-auth.middleware.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { submitResponseDto } from "../response/response.dto.js";
import {
  analytics,
  close,
  create,
  detail,
  list,
  publicDetail,
  publishResults,
  submitResponse,
  update,
} from "./poll.controller.js";
import {
  createPollDto,
  listPollsQueryDto,
  pollIdParamsDto,
  shareIdParamsDto,
  updatePollDto,
} from "./poll.dto.js";

export const pollRoutes = Router();
export const publicPollRoutes = Router();

pollRoutes.use(requireAuth);
pollRoutes.post("/", validateRequest({ body: createPollDto }), create);
pollRoutes.get("/", validateRequest({ query: listPollsQueryDto }), list);
pollRoutes.get("/:id", validateRequest({ params: pollIdParamsDto }), detail);
pollRoutes.patch(
  "/:id",
  validateRequest({ params: pollIdParamsDto, body: updatePollDto }),
  update
);
pollRoutes.post("/:id/close", validateRequest({ params: pollIdParamsDto }), close);
pollRoutes.post(
  "/:id/publish-results",
  validateRequest({ params: pollIdParamsDto }),
  publishResults
);
pollRoutes.get(
  "/:id/analytics",
  validateRequest({ params: pollIdParamsDto }),
  analytics
);

publicPollRoutes.get(
  "/:shareId",
  validateRequest({ params: shareIdParamsDto }),
  publicDetail
);
publicPollRoutes.post(
  "/:shareId/responses",
  optionalAuth,
  validateRequest({ params: shareIdParamsDto, body: submitResponseDto }),
  submitResponse
);
