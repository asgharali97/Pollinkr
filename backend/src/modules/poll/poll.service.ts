import { createHash } from "node:crypto";
import { Types } from "mongoose";
import { env } from "../../config/env.js";
import { emitPollUpdate } from "../../sockets/index.js";
import { ApiError } from "../../utils/api-error.js";
import { Poll, type IPoll, type PollDocument } from "./poll.model.js";
import { PollResponse } from "../response/response.model.js";
import type {
  CreatePollDto,
  ListPollsQueryDto,
  UpdatePollDto,
} from "./poll.dto.js";
import type { SubmitResponseDto } from "../response/response.dto.js";
import { buildPollAnalytics } from "./poll.analytics.js";

export type RespondentContext = {
  userId?: string;
  ip?: string;
  userAgent?: string;
};

export async function createPoll(userId: string, payload: CreatePollDto) {
  const responseMode =
    payload.responseMode ?? (payload.anonymous ? "anonymous" : "authenticated");
  const status = payload.status ?? "draft";
  if (status === "active" && !payload.expiresAt) {
    throw ApiError.badRequest("Published polls require an expiry date");
  }
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const poll = await Poll.create({
    creator: new Types.ObjectId(userId),
    title: payload.title,
    description: payload.description,
    responseMode,
    status,
    expiresAt: payload.expiresAt ?? expiryDate,
    questions: payload.questions,
  });

  return serializeCreatorPoll(poll);
}

export async function listCreatorPolls(userId: string, query: ListPollsQueryDto) {
  await expireDuePolls(userId);

  const filter: Record<string, unknown> = { creator: new Types.ObjectId(userId) };
  if (query.status) filter.status = query.status;
  if (query.search) filter.title = { $regex: escapeRegex(query.search), $options: "i" };

  const polls = await Poll.find(filter).sort({ createdAt: -1 });
  return polls.map(serializePollListItem);
}

export async function getCreatorPoll(userId: string, pollId: string) {
  const poll = await findOwnedPoll(userId, pollId);
  await syncExpiredPoll(poll);

  return serializeCreatorPoll(poll);
}

export async function updatePoll(
  userId: string,
  pollId: string,
  payload: UpdatePollDto
) {
  const poll = await findOwnedPoll(userId, pollId);
  await syncExpiredPoll(poll);

  if (poll.status === "published") {
    throw ApiError.badRequest("Published polls cannot be edited");
  }

  const hasStructuralChanges =
    payload.questions !== undefined || payload.responseMode !== undefined;

  if (hasStructuralChanges && poll.responseCount > 0) {
    throw ApiError.badRequest(
      "Questions, options, and response mode cannot be changed after responses start"
    );
  }

  if (payload.title !== undefined) poll.title = payload.title;
  if (payload.description !== undefined) poll.description = payload.description;
  if (payload.responseMode !== undefined) poll.responseMode = payload.responseMode;
  if (payload.expiresAt !== undefined) poll.expiresAt = payload.expiresAt;
  if (payload.status !== undefined) poll.status = payload.status;
  if (payload.questions !== undefined) {
    poll.questions = payload.questions as PollDocument["questions"];
  }


  await poll.save();
  return serializeCreatorPoll(poll);
}

export async function closePoll(userId: string, pollId: string) {
  const poll = await findOwnedPoll(userId, pollId);

  if (poll.status !== "active") {
    throw ApiError.badRequest("Only active polls can be closed");
  }

  poll.status = "expired";
  poll.closedAt = new Date();
  await poll.save();

  return serializeCreatorPoll(poll);
}

export async function deletePoll(userId: string, pollId: string) {
  const poll = await findOwnedPoll(userId, pollId);

  if (poll.status !== "draft") {
    throw ApiError.badRequest("Only draft polls can be deleted");
  }

  await Poll.deleteOne({ _id: pollId });

  return { message: "Poll deleted successfully" };
}

export async function publishPollResults(userId: string, pollId: string) {
  const poll = await findOwnedPoll(userId, pollId);
  await syncExpiredPoll(poll);

  if (poll.status === "draft") {
    throw ApiError.badRequest("Draft polls cannot publish results");
  }

  poll.status = "published";
  poll.publishedAt = new Date();
  await poll.save();

  return buildPollAnalytics(poll);
}

export async function getCreatorAnalytics(userId: string, pollId: string) {
  const poll = await findOwnedPoll(userId, pollId);
  await syncExpiredPoll(poll);

  return buildPollAnalytics(poll);
}

export async function getPublicPoll(shareId: string) {
  const poll = await Poll.findOne({ shareId });
  if (!poll) throw ApiError.notFound("Poll not found");

  await syncExpiredPoll(poll);

  if (poll.status === "published") {
    return {
      mode: "results",
      poll: await buildPollAnalytics(poll),
    };
  }

  if (poll.status !== "active") {
    return {
      mode: "closed",
      reason: poll.status,
      poll: serializePublicPollHeader(poll),
    };
  }

  return {
    mode: "response",
    poll: serializePublicPoll(poll),
  };
}

export async function submitPollResponse(
  shareId: string,
  payload: SubmitResponseDto,
  context: RespondentContext
) {
  const poll = await Poll.findOne({ shareId });
  if (!poll) throw ApiError.notFound("Poll not found");

  await syncExpiredPoll(poll);

  if (poll.status !== "active") {
    throw ApiError.badRequest(
      `This poll is not accepting responses because its status is "${poll.status}"`
    );
  }

  if (poll.responseMode === "authenticated" && !context.userId) {
    throw ApiError.unauthorized("Login is required to respond to this poll");
  }

  validateAnswersBelongToPoll(poll, payload.answers);

  const respondentUser =
    poll.responseMode === "authenticated" && context.userId
      ? new Types.ObjectId(context.userId)
      : null;
  const fingerprint =
    poll.responseMode === "anonymous"
      ? buildRespondentFingerprint(poll._id.toString(), context)
      : null;

  try {
    await PollResponse.create({
      poll: poll._id,
      respondentUser,
      respondentFingerprint: fingerprint,
      ipHash: context.ip ? hashValue(context.ip) : null,
      userAgentHash: context.userAgent ? hashValue(context.userAgent) : null,
      answers: payload.answers.map((answer) => ({
        questionId: new Types.ObjectId(answer.questionId),
        optionId: new Types.ObjectId(answer.optionId),
      })),
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw ApiError.conflict("You have already submitted a response to this poll");
    }

    throw error;
  }

  poll.responseCount += 1;
  await poll.save();
  const analytics = await buildPollAnalytics(poll);
  emitPollUpdate(poll._id.toString(), analytics);

  return {
    pollId: poll._id.toString(),
    totalResponses: poll.responseCount,
  };
}

async function findOwnedPoll(userId: string, pollId: string) {
  const poll = await Poll.findOne({
    _id: pollId,
    creator: userId,
  });

  if (!poll) throw ApiError.notFound("Poll not found");
  return poll;
}

async function syncExpiredPoll(poll: PollDocument) {
  if (
    poll.status === "active" &&
    poll.expiresAt !== null &&
    poll.expiresAt.getTime() <= Date.now()
  ) {
    poll.status = "expired";
    await poll.save();
  }
}

async function expireDuePolls(userId: string) {
  await Poll.updateMany(
    {
      creator: userId,
      status: "active",
      expiresAt: { $lte: new Date() },
    },
    { $set: { status: "expired" } }
  );
}

function validateAnswersBelongToPoll(
  poll: PollDocument,
  answers: SubmitResponseDto["answers"]
) {
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.optionId]));

  for (const question of poll.questions) {
    const questionId = question._id.toString();
    const selectedOptionId = answerMap.get(questionId);

    if (question.mandatory && !selectedOptionId) {
      throw ApiError.badRequest(`Question "${question.text}" is required`);
    }

    if (!selectedOptionId) continue;

    const optionExists = question.options.some(
      (option) => option._id.toString() === selectedOptionId
    );

    if (!optionExists) {
      throw ApiError.badRequest("One or more selected options are invalid");
    }

    answerMap.delete(questionId);
  }

  if (answerMap.size > 0) {
    throw ApiError.badRequest("One or more answered questions are invalid");
  }
}

function buildRespondentFingerprint(pollId: string, context: RespondentContext) {
  const ip = context.ip ?? "unknown-ip";
  const userAgent = context.userAgent ?? "unknown-agent";
  return hashValue(`${pollId}:${ip}:${userAgent}`);
}

function hashValue(value: string) {
  return createHash("sha256")
    .update(`${env.FINGERPRINT_SECRET}:${value}`)
    .digest("hex");
}

function serializeCreatorPoll(poll: PollDocument) {
  return {
    id: poll._id.toString(),
    shareId: poll.shareId,
    title: poll.title,
    description: poll.description,
    responseMode: poll.responseMode,
    anonymous: poll.responseMode === "anonymous",
    status: poll.status,
    expiresAt: poll.expiresAt,
    closedAt: poll.closedAt,
    publishedAt: poll.publishedAt,
    responseCount: poll.responseCount,
    questionCount: poll.questions.length,
    questions: poll.questions.map((question) => ({
      id: question._id.toString(),
      text: question.text,
      mandatory: question.mandatory,
      order: question.order,
      options: question.options.map((option) => ({
        id: option._id.toString(),
        text: option.text,
        order: option.order,
      })),
    })),
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
  };
}

function serializePollListItem(poll: PollDocument) {
  return {
    id: poll._id.toString(),
    shareId: poll.shareId,
    title: poll.title,
    status: poll.status,
    responseCount: poll.responseCount,
    questionCount: poll.questions.length,
    expiresAt: poll.expiresAt,
    createdAt: poll.createdAt,
    isAnonymous: poll.responseMode === "anonymous",
  };
}

function serializePublicPoll(poll: PollDocument) {
  return {
    ...serializePublicPollHeader(poll),
    questions: poll.questions.map((question) => ({
      id: question._id.toString(),
      text: question.text,
      mandatory: question.mandatory,
      options: question.options.map((option) => ({
        id: option._id.toString(),
        text: option.text,
      })),
    })),
  };
}

function serializePublicPollHeader(poll: PollDocument) {
  return {
    id: poll._id.toString(),
    shareId: poll.shareId,
    title: poll.title,
    description: poll.description,
    anonymous: poll.responseMode === "anonymous",
    responseMode: poll.responseMode,
    status: poll.status,
    expiresAt: poll.expiresAt,
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}
