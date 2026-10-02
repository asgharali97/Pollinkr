import { useMutation, useQuery } from "@tanstack/react-query";
import api, { type ApiEnvelope } from "@/lib/api";
import type { PublicPollResponse } from "@/types/index";

export interface SubmitResponsePayload {
  answers: {
    questionId: string;
    optionId: string;
  }[];
}


export const useGetPublicPoll = (shareId?: string) => {
  return useQuery({
    queryKey: ["public-polls", shareId],
    queryFn: async () => {
      if (!shareId) throw new Error("Share ID is required");
      const res = await api.get<ApiEnvelope<{ poll: PublicPollResponse }>>(
        `/public/polls/${shareId}`,
      );
      console.log("Fetched public poll:", res.data.data.poll);
      return res.data.data.poll;
    },
    enabled: !!shareId,
    staleTime: 1000 * 30,
  });
};

export const useSubmitResponse = (shareId: string) => {
  return useMutation({
    mutationFn: async (payload: SubmitResponsePayload) => {
      const res = await api.post(`/public/polls/${shareId}/responses`, payload);
      return res.data.data;
    },
  });
};