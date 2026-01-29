import React, { ComponentProps } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  className = "",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const combinedClassName = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

Button.displayName = "Button";
