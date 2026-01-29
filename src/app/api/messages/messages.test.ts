import { describe, test, expect, beforeAll } from "@jest/globals";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import type {
  CreateMessageResponse,
  GetMessagesResponse,
} from "@/lib/types/api";

describe("Messages API Integration Tests", () => {
  let createdMessageId: string;

  beforeAll(() => {
    // Ensure the Docker backend is running on port 3000
    console.log("Running integration tests");
    console.log("Note: Ensure Docker API is running on port 3000");
  });

  describe("POST /api/messages", () => {
    test("should create a new message", async () => {
      const newMessage = {
        message: "Test message from Jest integration test",
        author: "Jest Test Runner",
      };

      const request = new NextRequest("http://localhost:3001/api/messages", {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      const data: CreateMessageResponse = await response.json();

      // Verify response structure
      expect(data).toHaveProperty("_id");
      expect(data).toHaveProperty("message");
      expect(data).toHaveProperty("author");
      expect(data).toHaveProperty("createdAt");

      // Verify content
      expect(data.message).toBe(newMessage.message);
      expect(data.author).toBe(newMessage.author);
      expect(typeof data._id).toBe("string");
      expect(data._id.length).toBeGreaterThan(0);

      // Save for use in other tests
      createdMessageId = data._id;
    });

    test("should return 400 for missing required fields", async () => {
      const invalidMessage = {
        message: "Missing author field",
      };

      const request = new NextRequest("http://localhost:3001/api/messages", {
        method: "POST",
        body: JSON.stringify(invalidMessage),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty("error");
    });
  });

  describe("GET /api/messages", () => {
    test("should fetch messages list", async () => {
      const request = new NextRequest("http://localhost:3001/api/messages");

      const response = await GET(request);
      expect(response.status).toBe(200);

      const data: GetMessagesResponse = await response.json();

      // Verify response structure
      expect(data).toHaveProperty("messages");
      expect(Array.isArray(data.messages)).toBe(true);

      // If there are messages, verify structure
      if (data.messages.length > 0) {
        const firstMessage = data.messages[0];
        expect(firstMessage).toHaveProperty("_id");
        expect(firstMessage).toHaveProperty("message");
        expect(firstMessage).toHaveProperty("author");
        expect(firstMessage).toHaveProperty("createdAt");
      }
    });

    test("should fetch messages with limit parameter", async () => {
      const limit = 5;
      const request = new NextRequest(
        `http://localhost:3001/api/messages?limit=${limit}`
      );

      const response = await GET(request);
      expect(response.status).toBe(200);

      const data: GetMessagesResponse = await response.json();
      expect(data).toHaveProperty("messages");
      expect(Array.isArray(data.messages)).toBe(true);
      expect(data.messages.length).toBeLessThanOrEqual(limit);
    });

    test("should include the message we just created", async () => {
      const request = new NextRequest(
        "http://localhost:3001/api/messages?limit=50"
      );

      const response = await GET(request);
      expect(response.status).toBe(200);

      const data: GetMessagesResponse = await response.json();

      // Find our created message
      const foundMessage = data.messages.find(
        (msg) => msg._id === createdMessageId
      );

      expect(foundMessage).toBeDefined();
      if (foundMessage) {
        expect(foundMessage.message).toBe(
          "Test message from Jest integration test"
        );
        expect(foundMessage.author).toBe("Jest Test Runner");
      }
    });
  });
});
