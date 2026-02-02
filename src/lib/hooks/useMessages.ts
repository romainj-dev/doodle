import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetcher } from "@/lib/requests/fetcher-client";
import { queryKeys } from "@/lib/queries/queryKeys";
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  GetMessagesResponse,
} from "@/lib/types/api";
import type { Message } from "@/lib/types/message";

const PAGE_SIZE = 10;

/**
 * Hook for infinite scrolling messages
 * Loads messages in pages, with newest at the bottom
 */
export function useInfiniteMessages() {
  return useInfiniteQuery({
    queryKey: queryKeys.messages.list(),
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      return fetcher<GetMessagesResponse>({
        method: "GET",
        path: "/api/messages",
        params: {
          limit: PAGE_SIZE.toString(),
          before: pageParam,
        },
      });
    },
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (lastPageTSQ: GetMessagesResponse) => {
      // If we got fewer messages than requested, there are no more pages
      if (lastPageTSQ.messages.length < PAGE_SIZE) {
        return undefined;
      }
      const oldestMessage = lastPageTSQ.messages[0];
      return oldestMessage?.createdAt;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for posting messages with optimistic updates
 * Follows TanStack Query optimistic update pattern
 */
export function usePostMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageRequest) =>
      fetcher<CreateMessageResponse>({
        method: "POST",
        path: "/api/messages",
        body: data,
      }),
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages.list(),
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(
        queryKeys.messages.list()
      );

      console.log("previousMessages: ", previousMessages);
      // Optimistically update to the new value
      if (previousMessages) {
        queryClient.setQueryData(
          queryKeys.messages.list(),
          (old: { pages: Array<GetMessagesResponse> }) => {
            if (!old) return old;

            // Create optimistic message with temporary ID
            const optimisticMessage: Message = {
              _id: `temp-${Date.now()}`,
              message: newMessage.message,
              author: newMessage.author,
              createdAt: new Date().toISOString(),
            };

            // Add to the first page
            const newPages = [...old.pages];

            if (newPages.length > 0) {
              newPages[0] = {
                ...newPages[0],
                messages: [...newPages[0].messages, optimisticMessage],
              };
            } else {
              // If no pages exist yet, create the first page
              newPages.push({
                messages: [optimisticMessage],
              });
            }

            console.log("old.pages: ", old.pages);
            console.log("newPages: ", newPages);
            return {
              ...old,
              pages: newPages,
            };
          }
        );
      }

      return { previousMessages };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      console.error("Error on create message mutation: ", _err);
      if (context?.previousMessages) {
        queryClient.setQueryData(
          queryKeys.messages.list(),
          context.previousMessages
        );
      }
    },
  });
}
