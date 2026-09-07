
export type PollStatus = "draft" | "active" | "expired" | "published";

export interface Poll {
  id: string;
  title: string;
  status: PollStatus;
  responseCount: number;
  questionCount: number;
  expiresAt: string | null;
  createdAt: string;
  isAnonymous: boolean;
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
