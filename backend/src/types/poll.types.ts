export const POLL_STATUSES = ["draft", "active", "expired", "published"] as const;
export const RESPONSE_MODES = ["anonymous", "authenticated"] as const;

export type PollStatus = (typeof POLL_STATUSES)[number];
export type ResponseMode = (typeof RESPONSE_MODES)[number];
