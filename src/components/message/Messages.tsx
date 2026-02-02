"use client";

import { useMemo } from "react";
import { MessageList } from "@/components/message/MessageList";
import { useInfiniteMessages } from "@/lib/hooks/useMessages";
import { useTranslations } from "next-intl";

interface MessageErrorProps {
  error: Error;
}
function MessageError({ error }: MessageErrorProps) {
  const t = useTranslations("messages");
  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
      {t("error", { error: error?.message || "Unknown error" })}
    </div>
  );
}

function MessagesLoading() {
  const t = useTranslations("messages");
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>{t("loading")}</div>
  );
}

interface MessagesProps {
  initialTimestamp: string;
}

export function Messages({ initialTimestamp }: MessagesProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages({ initialTimestamp });

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

  // Show loading state on initial load (if prefetch didnt work)
  if (isLoading) {
    return <MessagesLoading />;
  }

  // Show error state
  if (isError) {
    return <MessageError error={error} />;
  }

  return (
    <MessageList
      messages={messages ?? []}
      isLoadingMore={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onLoadMore={handleLoadMore}
    />
  );
}
