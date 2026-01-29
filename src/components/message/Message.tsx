import styles from "./Message.module.css";

export interface MessageProps {
  variant?: "primary" | "secondary";
  author?: string;
  text: string;
  timestamp?: string;
  className?: string;
}

export function Message({
  className = "",
  variant = "secondary",
  author,
  text,
  timestamp,
}: MessageProps) {
  // TODO replace with actual check
  const isAuthor = variant === "primary";
  return (
    <div
      className={`${styles.container} ${isAuthor ? styles.primary : styles.secondary} ${className}`}
    >
      {author && <div className={styles.author}>{author}</div>}
      <div className={styles.text}>{text}</div>
      {timestamp && <div className={styles.timestamp}>{timestamp}</div>}
    </div>
  );
}

Message.displayName = "Message";
