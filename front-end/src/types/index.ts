export type PollStatus = "draft" | "active" | "expired" | "published";

export interface Poll {
  id: string;
  title: string;
  status: PollStatus;
  responseCount: number;
  questionCount: number;
  expiresAt: string | null;
  createdAt: string;
  anonymous: boolean;
  shareId: string;
}

export type PollUpdatePayload = {
  poll: {
    id: string;
    status: PollStatus;
    totalResponses: number;
  };
};

export type FilterTab = "all" | PollStatus;

export type PublicPoll = {
  id: string;
  shareId: string;
  title: string;
  description?: string;
  anonymous: boolean;
  status: PollStatus;
  expiresAt: string;
  questions: {
    id: string;
    text: string;
    mandatory: boolean;
    options: { id: string; text: string }[];
  }[];
};

export type PublicPollResponse = {
  poll: {
    id: string;
    shareId: string;
    anonymous: boolean;
    creatorId: string;
    description?: string;
    expiresAt?: string;
    participationRate: number;
    publishedAt: string;
    questionCount: number;
    responseMode: string;
    status: PollStatus;
    submittedAt: string[];
    title: string;
    totalResponses: number;
  };
  questions: AnalyticsQuestion[];
};

export type AnalyticsOption = {
  id: string;
  key: string;
  label: string;
  count: number;
};

export type AnalyticsQuestion = {
  id: string;
  text: string;
  mandatory: boolean;
  totalAnswers: number;
  options: AnalyticsOption[];
};

export type PollAnalytics = {
  poll: {
    id: string;
    shareId: string;
    title: string;
    status: PollStatus;
    creatorId: string;
    expiresAt: string | null;
    totalResponses: number;
    anonymous: boolean;
    participationRate: number;
    questionCount: number;
    /** ISO timestamps for each response, ordered chronologically */
    submittedAt: string[];
  };
  questions: AnalyticsQuestion[];
};

export type ResponseActivityPoint = {
  date: string;
  label: string;
  responses: number;
};

export type RankedAnswer = {
  key: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
};
