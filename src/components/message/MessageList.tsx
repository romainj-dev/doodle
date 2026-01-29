import { useRef } from "react";
import { Message, MessageProps } from "./Message";
import styles from "./MessageList.module.css";
import { Button } from "@/components/ui/Button";

interface MessageListProps {
  messages: MessageProps[];
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export function MessageList({
  messages,
  isLoadingMore = false,
  onLoadMore,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={listRef} className={styles.container}>
      {isLoadingMore && (
        <div className={styles.loading}>
          <div
            className={styles.spinner}
            role="status"
            aria-label="Loading more messages"
          />
        </div>
      )}
      <Button onClick={onLoadMore}>Load more</Button>
      {messages.map((msg, index) => (
        <Message key={index} {...msg} />
      ))}
    </div>
  );
}

MessageList.displayName = "MessageList";
