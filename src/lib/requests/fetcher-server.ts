const CHAT_API_URL = process.env.CHAT_API_URL || "http://localhost:3000";
const CHAT_API_TOKEN =
  process.env.CHAT_API_TOKEN || "super-secret-doodle-token";

type GetterServerOptions = {
  path: string;
  params?: Record<string, string | undefined>;
};

/**
 * Fetches server-side data from the external chat API
 */
export async function getterServer<T>(
  options: GetterServerOptions
): Promise<{ data: T | null; error: string | null; status: number }> {
  const { path, params } = options;

  try {
    const searchParams = new URLSearchParams();

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      }
    }

    const queryString = searchParams.toString();
    const url = `${CHAT_API_URL}${path}${queryString ? `?${queryString}` : ""}`;

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
      return {
        data: null,
        error: errorText,
        status: response.status,
      };
    }

    const data: T = await response.json();
    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      data: null,
      error: "Internal server error",
      status: 500,
    };
  }
}
