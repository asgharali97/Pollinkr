import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response.js";
import type {
  CreatePollDto,
  ListPollsQueryDto,
  UpdatePollDto,
} from "./poll.dto.js";
import {
  closePoll,
  createPoll,
  getCreatorAnalytics,
  getCreatorPoll,
  getPublicPoll,
  listCreatorPolls,
  publishPollResults,
  submitPollResponse,
  updatePoll,
} from "./poll.service.js";
import type { SubmitResponseDto } from "../response/response.dto.js";
import type { RespondentContext } from "./poll.service.js";

export async function create(req: Request, res: Response) {
  const poll = await createPoll(req.user!.id, getValidatedBody<CreatePollDto>(req));
  return ApiResponse.created(res, "Poll created successfully", poll);
}

export async function list(req: Request, res: Response) {
  const polls = await listCreatorPolls(
    req.user!.id,
    getValidatedQuery<ListPollsQueryDto>(req)
  );
  return ApiResponse.ok(res, "Polls fetched successfully", { polls });
}

export async function detail(req: Request, res: Response) {
  const poll = await getCreatorPoll(req.user!.id, getParam(req, "id"));
  return ApiResponse.ok(res, "Poll fetched successfully", { poll });
}

export async function update(req: Request, res: Response) {
  const poll = await updatePoll(
    req.user!.id,
    getParam(req, "id"),
    getValidatedBody<UpdatePollDto>(req)
  );
  return ApiResponse.ok(res, "Poll updated successfully", { poll });
}

export async function close(req: Request, res: Response) {
  const poll = await closePoll(req.user!.id, getParam(req, "id"));
  return ApiResponse.ok(res, "Poll closed successfully", { poll });
}

export async function publishResults(req: Request, res: Response) {
  const analytics = await publishPollResults(req.user!.id, getParam(req, "id"));
  return ApiResponse.ok(res, "Poll results published successfully", analytics);
}

export async function analytics(req: Request, res: Response) {
  const data = await getCreatorAnalytics(req.user!.id, getParam(req, "id"));
  return ApiResponse.ok(res, "Poll analytics fetched successfully", data);
}

export async function publicDetail(req: Request, res: Response) {
  const data = await getPublicPoll(getParam(req, "shareId"));
  return ApiResponse.ok(res, "Public poll fetched successfully", data);
}

export async function submitResponse(req: Request, res: Response) {
  const context: RespondentContext = {};
  if (req.user?.id) context.userId = req.user.id;
  if (req.ip) context.ip = req.ip;
  const userAgent = req.get("user-agent");
  if (userAgent) context.userAgent = userAgent;

  const result = await submitPollResponse(
    getParam(req, "shareId"),
    getValidatedBody<SubmitResponseDto>(req),
    context
  );

  return ApiResponse.created(res, "Response submitted successfully", result);
}

function getParam(req: Request, name: string) {
  const params = (req.validated?.params ?? req.params) as Record<string, unknown>;
  const value = params[name];
  if (typeof value !== "string") {
    throw new Error(`Missing route param: ${name}`);
  }

  return value;
}

function getValidatedBody<T>(req: Request) {
  return (req.validated?.body ?? req.body) as T;
}

function getValidatedQuery<T>(req: Request) {
  return (req.validated?.query ?? req.query) as T;
}
