import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MessageItem } from "./MessageItem";
import styles from "./MessageList.module.css";
import type { Message } from "@/lib/types/message";

interface MessageListProps {
  messages: Message[];
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export function MessageList({
  messages,
  isLoadingMore = false,
  hasNextPage = false,
  onLoadMore,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const hasInitialScrollRef = useRef(false);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  });

  function onInitRef(current: HTMLDivElement) {
    if (!hasInitialScrollRef.current) {
      current.scrollIntoView({ behavior: "instant" });
      hasInitialScrollRef.current = true;
    }
  }
  // Trigger load more when sentinel comes into view (only after initial scroll)
  useEffect(() => {
    if (
      hasInitialScrollRef.current &&
      inView &&
      hasNextPage &&
      !isLoadingMore
    ) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isLoadingMore, onLoadMore]);

  return (
    <div ref={listRef} className={styles.container}>
      {/* Sentinel element at the top for loading older messages */}
      {hasNextPage && (
        <div key="loader" ref={inViewRef} className={styles.loading}>
          <div
            className={styles.spinner}
            role="status"
            aria-label="Loading more messages"
          />
        </div>
      )}
      {messages.map((message) => (
        <MessageItem key={message["_id"]} item={message} />
      ))}
      <div ref={onInitRef} />
    </div>
  );
}
