type FetcherOptions = {
  method: "GET" | "POST";
  path: string;
  params?: Record<string, string | undefined>;
  body?: unknown;
};

export async function fetcher<T>(options: FetcherOptions): Promise<T> {
  const { method, path, params, body } = options;

  // Handle params
  const searchParams = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, value);
      }
    }
  }
  const queryString = searchParams.toString();
  const url = `${path}${queryString ? `?${queryString}` : ""}`;

  // Handle body
  const bodyData = body ? JSON.stringify(body) : undefined;

  // Handle response
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: bodyData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to ${method} ${path}`);
  }

  return response.json();
}
