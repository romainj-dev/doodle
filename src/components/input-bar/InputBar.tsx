import React from "react";
import { TextInput } from "../ui/TextInput";
import styles from "./InputBar.module.css";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface InputBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function InputBar({ value, onChange, onSend, disabled }: InputBarProps) {
  const t = useTranslations("messages");
  // TODO replace by using a form and a submit button
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <TextInput
          id="message-input"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          containerClassName={styles.inputContainer}
          disabled={disabled}
          autoComplete="off"
          aria-label="Message input"
        />
        <Button
          className={styles.sendButton}
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          {t("send")}
        </Button>
      </div>
    </div>
  );
}

InputBar.displayName = "InputBar";
