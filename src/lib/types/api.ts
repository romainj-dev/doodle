/**
 * Types for the Doodle Chat API
 * Based on: https://github.com/DoodleScheduling/frontend-challenge-chat-api
 */

import type { Message } from "./message";

/**
 * Request body for creating a new message
 */
export type CreateMessageRequest = {
  message: string;
  author: string;
};

/**
 * Response from POST /api/messages
 */
export type CreateMessageResponse = {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
};

/**
 * Query parameters for GET /api/messages
 */
export type GetMessagesParams = {
  limit?: number;
  after?: string; // ISO date string
  before?: string; // ISO date string
};

/**
 * Response from GET /api/messages
 */
export type GetMessagesResponse = {
  messages: Message[];
};

export type GetMessagesExternalApiResponse = Message[];
