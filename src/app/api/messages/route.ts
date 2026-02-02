import { NextRequest, NextResponse } from "next/server";
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  GetMessagesResponse,
  GetMessagesParams,
  GetMessagesExternalApiResponse,
} from "@/lib/types/api";
import { getterServer } from "@/lib/requests/fetcher-server";

const CHAT_API_URL = process.env.CHAT_API_URL || "http://localhost:3000";
const CHAT_API_TOKEN =
  process.env.CHAT_API_TOKEN || "super-secret-doodle-token";

/**
 * GET /api/messages
 * Fetches messages from the external chat API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse and validate query parameters
  const queryParams: GetMessagesParams = {
    limit: searchParams.has("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
    after: searchParams.get("after") ?? undefined,
    before: searchParams.get("before") ?? undefined,
  };

  const result = await getterServer<GetMessagesExternalApiResponse>({
    path: "/api/v1/messages",
    params: {
      limit: queryParams.limit?.toString(),
      after: queryParams.after,
      before: queryParams.before,
    },
  });

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  const messages: GetMessagesResponse = { messages: result.data ?? [] };
  return NextResponse.json(messages);
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
