"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import { MessageList } from "@/components/message/MessageList";
import { InputBar } from "@/components/input-bar/InputBar";
import { useInfiniteMessages, usePostMessage } from "@/lib/hooks/useMessages";
import { DEFAULT_AUTHOR } from "@/lib/author/constants";
import { encodeHtmlEntities } from "@/lib/utils/htmlEntities";

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  // Fetch messages with infinite scroll
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages();
  // Post message mutation
  const postMessageMutation = usePostMessage();

  const messages = useMemo(() => {
    return (
      [...(data?.pages ?? [])].reverse().flatMap((page) => page.messages) ?? []
    );
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    postMessageMutation.mutate(
      {
        message: encodeHtmlEntities(inputValue),
        author: DEFAULT_AUTHOR,
      },
      {
        onSuccess: () => {
          setInputValue("");
        },
      }
    );
  };

  // Show loading state on initial load
  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading messages...
          </div>
        </div>
        <div className={styles.backgroundFixed} />
      </main>
    );
  }

  // Show error state
  if (isError) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            Error loading messages: {error?.message || "Unknown error"}
          </div>
        </div>
        <div className={styles.backgroundFixed} />
      </main>
    );
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.content}>
          <MessageList
            messages={messages ?? []}
            isLoadingMore={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onLoadMore={handleLoadMore}
          />
        </div>
        <InputBar
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSend}
          disabled={postMessageMutation.isPending}
        />
        <div className={styles.backgroundFixed} />
      </main>
    </>
  );
}
