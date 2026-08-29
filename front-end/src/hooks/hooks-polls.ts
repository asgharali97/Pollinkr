import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { type ApiEnvelope } from "@/lib/api";

export interface Question {
  id: string;
  text: string;
  mandatory: boolean;
  options: { id: string; text: string }[];
}

export interface Poll {
    id: string;
    title: string;
    description?: string;
    status: "draft" | "active" | "expired" | "published";
    anonymous: boolean;
    expiresAt?: string;
    createdAt: string;
    shareId: string;
    responseCount: number;
    questionCount: number;
    questions: Question[];
}

export interface PollListQuery {
  page?: number;
  limit?: number;
  status?: "draft" | "active" | "expired" | "published";
}

export interface CreatePollPayload {
  title: string;
  description?: string;
  isAnonymous: boolean;
  responseMode: "anonymous" | "authenticated";
  expiresAt?: string;
  status: "draft" | "active";
  questions: {
    text: string;
    mandatory: boolean;
    options: { text: string }[];
  }[];
}

export interface UpdatePollPayload {
  title?: string;
  description?: string;
  isAnonymous?: boolean;
  expiresAt?: string;
  status: "draft" | "active" | "expired" | "published";
  responseMode: "anonymous" | "authenticated";
  questions?: {
    id?: string;
    text: string;
    mandatory: boolean;
    options: { id?: string; text: string }[];
  }[];
}

export const useListPolls = (query?: PollListQuery) => {
  return useQuery({
    queryKey: ["polls", query],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<{ polls: Poll[] }>>("/polls", {
        params: query,
      });
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
};

export const useGetPoll = (id?: string) => {
  return useQuery({
    queryKey: ["polls", id],
    queryFn: async () => {
      if (!id) throw new Error("Poll ID is required");
      const res = await api.get<ApiEnvelope<{ poll: Poll }>>(`/polls/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

export const useCreatePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePollPayload) => {
      const res = await api.post<ApiEnvelope<{ poll: Poll }>>("/polls", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
};

export const useUpdatePoll = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePollPayload) => {
      const res = await api.patch<ApiEnvelope<{ poll: Poll }>>(
        `/polls/${id}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["polls", id] });
    },
  });
};
export const useClosePoll = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post(`/polls/${id}/close`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] }); 
      queryClient.removeQueries({ queryKey: ["polls", id] });
    },
  });
};

export const useDeletePoll = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/polls/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] }); 
      queryClient.removeQueries({ queryKey: ["polls", id] });
    },
  });
};
export const usePublishResults = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post<ApiEnvelope<{ poll: Poll }>>(
        `/polls/${id}/publish-results`,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["polls", id] });
    },
  });
};

export const useGetAnalytics = (id?: string) => {
  return useQuery({
    queryKey: ["polls", id, "analytics"],
    queryFn: async () => {
      if (!id) throw new Error("Poll ID is required");
      const res = await api.get(`/polls/${id}/analytics`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 10,
  });
};
