export async function apiFetch(
  endpoint: string,
  {
    method = "GET",
    data,
    headers = {},
  }: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    headers?: Record<string, string>;
  } = {}
) {
  const res = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(data && { body: JSON.stringify(data) }),
  });

  const contentType = res.headers.get("Content-Type");
  const isJson = contentType?.includes("application/json");
  const responseData = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    throw new Error(responseData?.error || responseData || "Request failed");
  }

  return responseData;
}
