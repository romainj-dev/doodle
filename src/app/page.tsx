import { InputBar } from "@/components/input-bar/InputBar";
import { Messages } from "@/components/message/Messages";
import styles from "./page.module.css";
import { queryKeys } from "@/lib/queries/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  GetMessagesExternalApiResponse,
  GetMessagesResponse,
} from "@/lib/types/api";
import { PAGE_SIZE } from "@/lib/hooks/useMessages";
import { getterServer } from "@/lib/requests/fetcher-server";

export default async function Home() {
  const queryClient = new QueryClient();
  // Generate timestamp once - used by both server prefetch and client hook
  const initialTimestamp = new Date().toISOString();

  // Prefetch first page of messages
  await Promise.all([
    await queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.messages.list(),
      queryFn: async ({ pageParam }: { pageParam: string }) => {
        try {
          const result = await getterServer<GetMessagesExternalApiResponse>({
            path: "/api/v1/messages",
            params: {
              limit: PAGE_SIZE.toString(),
              before: pageParam,
            },
          });

          if (result.error) {
            console.error("[Server Prefetch] Failed:", result.error);
            return { messages: [] };
          }

          return { messages: result.data ?? [] };
        } catch (error) {
          console.error("[Server Prefetch] Failed:", error);
          return { messages: [] };
        }
      },
      initialPageParam: initialTimestamp,
      getNextPageParam: (lastPage: GetMessagesResponse) =>
        lastPage.messages[0]?.createdAt ?? undefined,
      pages: 1,
    }),
  ]);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Messages initialTimestamp={initialTimestamp} />
        </HydrationBoundary>
      </div>
      <InputBar />
      <div className={styles.backgroundFixed} />
    </main>
  );
}
