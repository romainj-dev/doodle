"use client";

import React, { useState, type SubmitEvent } from "react";
import styles from "./InputBar.module.css";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useTranslations } from "next-intl";
import { usePostMessage } from "@/lib/hooks/useMessages";
import { encodeHtmlEntities } from "@/lib/utils/htmlEntities";
import { DEFAULT_AUTHOR } from "@/lib/author/constants";

export function InputBar() {
  const [inputValue, setInputValue] = useState("");
  const value = inputValue.trim();

  const t = useTranslations("messages");

  const { mutate: postMessage, isPending } = usePostMessage();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) return;

    postMessage(
      {
        message: encodeHtmlEntities(value),
        author: DEFAULT_AUTHOR,
      },
      {
        onSuccess: () => {
          setInputValue("");
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <form className={styles.content} onSubmit={handleSubmit}>
        <TextInput
          id="message-input"
          value={value}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("placeholder")}
          containerClassName={styles.inputContainer}
          disabled={isPending}
          autoComplete="off"
          aria-label={t("messageInput")}
        />
        <Button
          className={styles.sendButton}
          type="submit"
          disabled={isPending || !value}
          aria-label={t("send")}
        >
          {t("send")}
        </Button>
      </form>
    </div>
  );
}
