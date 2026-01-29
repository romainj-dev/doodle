import React, { ComponentProps } from "react";
import styles from "./TextInput.module.css";

export interface TextInputProps extends ComponentProps<"input"> {
  id: string;
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function TextInput({
  id,
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className={`${styles.container} ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={id}
          className={`${styles.input} ${error ? styles.errorInput : ""} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

TextInput.displayName = "TextInput";
