import { randomBytes } from "node:crypto";
import {
  Schema,
  model,
  Types,
  type HydratedDocument,
  type Model,
} from "mongoose";
import {
  POLL_STATUSES,
  RESPONSE_MODES,
  type PollStatus,
  type ResponseMode,
} from "../../types/poll.types.js";

export interface IPollOption {
  _id: Types.ObjectId;
  text: string;
  order: number;
}

export interface IPollQuestion {
  _id: Types.ObjectId;
  text: string;
  mandatory: boolean;
  order: number;
  options: IPollOption[];
}

export interface IPoll {
  creator: Types.ObjectId;
  title: string;
  description: string;
  shareId: string;
  responseMode: ResponseMode;
  status: PollStatus;
  expiresAt: Date | null;
  closedAt: Date | null;
  publishedAt: Date | null;
  questions: IPollQuestion[];
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PollDocument = HydratedDocument<IPoll>;
export type PollModel = Model<IPoll>;

const pollOptionSchema = new Schema<IPollOption>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 300,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true, id: false }
);

const pollQuestionSchema = new Schema<IPollQuestion>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
    mandatory: {
      type: Boolean,
      required: true,
      default: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    options: {
      type: [pollOptionSchema],
      validate: {
        validator(options: IPollOption[]) {
          return options.length >= 2;
        },
        message: "Each question must have at least 2 options",
      },
    },
  },
  { _id: true, id: false }
);

const pollSchema = new Schema<IPoll, PollModel>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: "",
    },
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    responseMode: {
      type: String,
      enum: RESPONSE_MODES,
      required: true,
      default: "authenticated",
    },
    status: {
      type: String,
      enum: POLL_STATUSES,
      required: true,
      default: "draft",
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    questions: {
      type: [pollQuestionSchema],
      validate: {
        validator(questions: IPollQuestion[]) {
          return questions.length >= 1;
        },
        message: "A poll must have at least 1 question",
      },
    },
    responseCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

pollSchema.index({ creator: 1, status: 1, createdAt: -1 });
pollSchema.index({ status: 1, expiresAt: 1 });

pollSchema.pre("validate", function assignShareId() {
  if (!this.shareId) {
    this.shareId = randomBytes(8).toString("base64url");
  }
});

pollSchema.pre("validate", function normalizeQuestionAndOptionOrder() {
  this.questions.forEach((question, questionIndex) => {
    question.order = questionIndex;
    question.options.forEach((option, optionIndex) => {
      option.order = optionIndex;
    });
  });
});

pollSchema.path("expiresAt").validate(function validateExpiry(value: Date | null) {
  if (this.status !== "active") return true;
  if (value === null) return false;
  return value.getTime() > Date.now();
}, "Active polls must have a future expiry date");

export const Poll = model<IPoll, PollModel>("Poll", pollSchema);
