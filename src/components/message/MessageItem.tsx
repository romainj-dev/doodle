import type { Message } from "@/lib/types/message";
import { DEFAULT_AUTHOR } from "@/lib/author/constants";
import { decodeHtmlEntities } from "@/lib/utils/htmlEntities";
import styles from "./MessageItem.module.css";

/**
 * Formats ISO date string to readable timestamp
 */
function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface MessageItemProps {
  item: Message;
  "data-message-id"?: string;
}

export function MessageItem({
  item,
  "data-message-id": dataMessageId,
}: MessageItemProps) {
  const { author, message, createdAt } = item;
  const timestamp = formatTimestamp(createdAt);
  const isAuthor = author === DEFAULT_AUTHOR;
  return (
    <div
      className={`${styles.container} ${isAuthor ? styles.primary : styles.secondary}`}
      data-message-id={dataMessageId}
    >
      {author && <div className={styles.author}>{author}</div>}
      <div className={styles.text}>{decodeHtmlEntities(message)}</div>
      {timestamp && <div className={styles.timestamp}>{timestamp}</div>}
    </div>
  );
}
