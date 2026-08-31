
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
