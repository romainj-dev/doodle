/**
 * Query key factory for TanStack Query
 * Provides type-safe, hierarchical query keys for the application
 */

export const queryKeys = {
  messages: {
    all: ["messages"] as const,
    list: () => [...queryKeys.messages.all, "list"] as const,
  },
} as const;
