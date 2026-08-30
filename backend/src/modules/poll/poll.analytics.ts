import type { Types } from "mongoose";
import type { IPollQuestion, PollDocument } from "./poll.model.js";
import { PollResponse } from "../response/response.model.js";

type OptionSummary = {
  id: string;
  key: string;
  label: string;
  count: number;
};

type QuestionSummary = {
  id: string;
  text: string;
  mandatory: boolean;
  totalAnswers: number;
  options: OptionSummary[];
};

export async function buildPollAnalytics(poll: PollDocument) {
  const responses = await PollResponse.find({ poll: poll._id }).select("answers").lean();
  const questionMap = buildQuestionMap(poll.questions);

  for (const response of responses) {
    for (const answer of response.answers) {
      const question = questionMap.get(answer.questionId.toString());
      if (!question) continue;

      question.totalAnswers += 1;
      const option = question.options.find(
        (item) => item.id === answer.optionId.toString()
      );
      if (option) option.count += 1;
    }
  }

  const answeredSlots = Array.from(questionMap.values()).reduce(
    (total, question) => total + question.totalAnswers,
    0
  );
  const participationRate =
    poll.questions.length === 0 || poll.responseCount === 0
      ? 0
      : Math.round((answeredSlots / (poll.questions.length * poll.responseCount)) * 100);

  return {
    poll: {
      id: poll._id.toString(),
      creatorId: poll.creator.toString(),
      shareId: poll.shareId,
      title: poll.title,
      description: poll.description,
      status: poll.status,
      expiresAt: poll.expiresAt,
      publishedAt: poll.publishedAt,
      totalResponses: poll.responseCount,
      isAnonymous: poll.responseMode === "anonymous",
      responseMode: poll.responseMode,
      questionCount: poll.questions.length,
      participationRate,
    },
    questions: Array.from(questionMap.values()),
  };
}

function buildQuestionMap(questions: IPollQuestion[]) {
  const questionMap = new Map<string, QuestionSummary>();

  for (const question of questions) {
    questionMap.set(question._id.toString(), {
      id: question._id.toString(),
      text: question.text,
      mandatory: question.mandatory,
      totalAnswers: 0,
      options: question.options.map((option) => ({
        id: option._id.toString(),
        key: option._id.toString(),
        label: option.text,
        count: 0,
      })),
    });
  }

  return questionMap;
}

export function toObjectId(id: string) {
  return id as unknown as Types.ObjectId;
}
