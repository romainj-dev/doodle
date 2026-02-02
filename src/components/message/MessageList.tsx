"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MessageItem } from "./MessageItem";
import styles from "./MessageList.module.css";
import type { Message } from "@/lib/types/message";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("messages");
  const listRef = useRef<HTMLDivElement>(null);
  const hasInitialScrollRef = useRef(false);

  // Prevent multiple consecutive calls to onLoadMore
  const isLoadingMoreRef = useRef(isLoadingMore);
  // Store the first message ID before loading to restore the scroll position
  const firstVisibleIdRef = useRef<string | null>(null);

  const { ref: inViewRef } = useInView({
    threshold: 0,
    rootMargin: "400px 0px 0px 0px",
    onChange: (inView) => {
      if (
        hasInitialScrollRef.current &&
        inView &&
        hasNextPage &&
        !isLoadingMoreRef.current
      ) {
        isLoadingMoreRef.current = true;
        firstVisibleIdRef.current = messages[0]?._id ?? null;
        onLoadMore();
      }
    },
  });

  // This is a temporary hack to restore the scroll position after new messages are prepended.
  // It is currently creating a flickering effect when the new messages are prepended.
  // TODO: This issue is not supposed to happen - my guess is that the root issue is mostlikely in the css layouting.
  useLayoutEffect(() => {
    if (!firstVisibleIdRef.current || !listRef.current) return;

    const anchorElement = listRef.current.querySelector(
      `[data-message-id="${firstVisibleIdRef.current}"]`
    );

    if (anchorElement) {
      anchorElement.scrollIntoView({ block: "start", behavior: "instant" });
    }

    firstVisibleIdRef.current = null;
  }, [messages]);

  useEffect(() => {
    if (isLoadingMoreRef.current && !isLoadingMore) {
      isLoadingMoreRef.current = false;
    }
  }, [isLoadingMore]);

  function onInitRef(current: HTMLDivElement) {
    if (!hasInitialScrollRef.current) {
      current.scrollIntoView({ behavior: "instant" });
      hasInitialScrollRef.current = true;
    }
  }

  return (
    <div ref={listRef} className={styles.container}>
      {/* Sentinel element at the top for loading older messages */}
      {hasNextPage && (
        <div key="loader" ref={inViewRef} className={styles.loading}>
          <div
            className={styles.spinner}
            role="status"
            aria-label={t("loadMore")}
          />
        </div>
      )}
      {messages.map((message) => (
        <MessageItem
          key={message["_id"]}
          item={message}
          data-message-id={message["_id"]}
        />
      ))}
      <div ref={onInitRef} />
    </div>
  );
}
