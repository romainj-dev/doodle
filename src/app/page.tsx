"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { MessageList } from "@/components/message/MessageList";
import { InputBar } from "@/components/input-bar/InputBar";
import { MessageProps } from "@/components/message/Message";

const INITIAL_MESSAGES: MessageProps[] = [
  {
    author: "I am mister brilliant",
    text: "THANKS!!!!",
    timestamp: "10 Mar 2018 10:10",
    variant: "secondary",
  },
  {
    author: "martin57",
    text: "Thanks Peter",
    timestamp: "10 Mar 2018 10:19",
    variant: "secondary",
  },
  {
    author: "Patricia",
    text: "Sounds good to me!",
    timestamp: "10 Mar 2018 10:22",
    variant: "secondary",
  },
  {
    text: "Hey folks! I wanted to get in touch with you regarding the project. Please, let me know how you plan to contribute.",
    timestamp: "12 Mar 2018 14:38",
    variant: "primary",
  },
];

export default function Home() {
  const [messages, setMessages] = useState<MessageProps[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Mock network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const moreMessages: MessageProps[] = [
      {
        author: "Old User",
        text: "Previous message loaded from history...",
        timestamp: "09 Mar 2018 09:00",
        variant: "secondary",
      },
      {
        author: "Another Old User",
        text: "More history here.",
        timestamp: "09 Mar 2018 09:05",
        variant: "secondary",
      },
    ];

    setMessages((prev) => [...moreMessages, ...prev]);
    setIsLoading(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: MessageProps = {
      text: inputValue,
      timestamp: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      variant: "primary",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.content}>
          <MessageList
            messages={messages}
            isLoadingMore={isLoading}
            onLoadMore={handleLoadMore}
          />
        </div>
        <InputBar
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSend}
        />
        <div className={styles.backgroundFixed} />
      </main>
    </>
  );
}
