import React from "react";
import styles from "./InputBar.module.css";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useTranslations } from "next-intl";

interface InputBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function InputBar({ value, onChange, onSend, disabled }: InputBarProps) {
  const t = useTranslations("messages");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className={styles.container}>
      <form className={styles.content} onSubmit={handleSubmit}>
        <TextInput
          id="message-input"
          value={value}
          onChange={onChange}
          placeholder="Type a message..."
          containerClassName={styles.inputContainer}
          disabled={disabled}
          autoComplete="off"
          aria-label="Message input"
        />
        <Button
          className={styles.sendButton}
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          {t("send")}
        </Button>
      </form>
    </div>
  );
}

InputBar.displayName = "InputBar";
