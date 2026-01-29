import { NextRequest, NextResponse } from "next/server";
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  GetMessagesResponse,
  GetMessagesParams,
} from "@/lib/types/api";
import type { Message } from "@/lib/types/message";

const CHAT_API_URL = process.env.CHAT_API_URL || "http://localhost:3000";
const CHAT_API_TOKEN =
  process.env.CHAT_API_TOKEN || "super-secret-doodle-token";

export type GetMessagesExternalApiResponse = Message[];

/**
 * GET /api/messages
 * Fetches messages from the external chat API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams: GetMessagesParams = {
      limit: searchParams.has("limit")
        ? Number(searchParams.get("limit"))
        : undefined,
      after: searchParams.get("after") ?? undefined,
      before: searchParams.get("before") ?? undefined,
    };

    // Build query string for external API
    const params = new URLSearchParams();
    if (queryParams.limit) params.append("limit", queryParams.limit.toString());
    if (queryParams.after) params.append("after", queryParams.after);
    if (queryParams.before) params.append("before", queryParams.before);

    const queryString = params.toString();
    const url = `${CHAT_API_URL}/api/v1/messages${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAT_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("External API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: response.status }
      );
    }

    const messages: GetMessagesExternalApiResponse = await response.json();
    const result: GetMessagesResponse = { messages };
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * Creates a new message in the external chat API
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateMessageRequest = await request.json();

    if (!body.message || !body.author) {
      return NextResponse.json(
        { error: "Missing required fields: message and author" },
        { status: 400 }
      );
    }

    const response = await fetch(`${CHAT_API_URL}/api/v1/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAT_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("External API error:", errorText);
      return NextResponse.json(
        { error: "Failed to create message" },
        { status: response.status }
      );
    }

    const data: CreateMessageResponse = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
