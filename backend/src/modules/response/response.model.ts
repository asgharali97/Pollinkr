import {
  Schema,
  model,
  Types,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface IResponseAnswer {
  questionId: Types.ObjectId;
  optionId: Types.ObjectId;
}

export interface IPollResponse {
  poll: Types.ObjectId;
  respondentUser: Types.ObjectId | null;
  respondentFingerprint: string | null;
  answers: IResponseAnswer[];
  submittedAt: Date;
  userAgentHash: string | null;
  ipHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PollResponseDocument = HydratedDocument<IPollResponse>;
export type PollResponseModel = Model<IPollResponse>;

const responseAnswerSchema = new Schema<IResponseAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    optionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { _id: false, id: false }
);

const pollResponseSchema = new Schema<IPollResponse, PollResponseModel>(
  {
    poll: {
      type: Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
      index: true,
    },
    respondentUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    respondentFingerprint: {
      type: String,
      default: null,
      trim: true,
      select: false,
    },
    answers: {
      type: [responseAnswerSchema],
      required: true,
      validate: [
        {
          validator(answers: IResponseAnswer[]) {
            return answers.length > 0;
          },
          message: "A response must include at least 1 answer",
        },
        {
          validator(answers: IResponseAnswer[]) {
            const questionIds = answers.map((answer) => answer.questionId.toString());
            return new Set(questionIds).size === questionIds.length;
          },
          message: "A response cannot answer the same question more than once",
        },
      ],
    },
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userAgentHash: {
      type: String,
      default: null,
      select: false,
    },
    ipHash: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

pollResponseSchema.index(
  { poll: 1, respondentUser: 1 },
  {
    unique: true,
    partialFilterExpression: {
      respondentUser: { $type: "objectId" },
    },
  }
);

pollResponseSchema.index(
  { poll: 1, respondentFingerprint: 1 },
  {
    unique: true,
    partialFilterExpression: {
      respondentFingerprint: { $type: "string" },
    },
  }
);

export const PollResponse = model<IPollResponse, PollResponseModel>(
  "PollResponse",
  pollResponseSchema
);
