import defaultJson from "../theme/theme.config.json";

const TOKEN_KEY = "token";

let apiUrl: string = defaultJson.env.apiUrl;

/** Overrides the base url used by the wrappers (ThemeProvider calls it with `env.apiUrl`). */
export function setApiUrl(url: string) {
  apiUrl = url;
}

export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function toQuery(data: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) params.append(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function request<T>(
  method: Method,
  route: string,
  data?: object,
  requireAuth = false,
): Promise<T> {
  const hasBody = method !== "GET" && method !== "DELETE" && data !== undefined;
  const headers: Record<string, string> = {};
  if (hasBody) headers["Content-Type"] = "application/json";
  if (requireAuth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const query = !hasBody && data ? toQuery(data) : "";
  const response = await fetch(`${apiUrl}${route}${query}`, {
    method,
    headers,
    body: hasBody ? JSON.stringify(data) : undefined,
  });

  const text = await response.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!response.ok) throw new HttpError(response.status, body);
  return body as T;
}

export const get = <T = unknown>(route: string, data?: object, requireAuth?: boolean) =>
  request<T>("GET", route, data, requireAuth);
export const post = <T = unknown>(route: string, data?: object, requireAuth?: boolean) =>
  request<T>("POST", route, data, requireAuth);
export const put = <T = unknown>(route: string, data?: object, requireAuth?: boolean) =>
  request<T>("PUT", route, data, requireAuth);
export const patch = <T = unknown>(route: string, data?: object, requireAuth?: boolean) =>
  request<T>("PATCH", route, data, requireAuth);
export const del = <T = unknown>(route: string, data?: object, requireAuth?: boolean) =>
  request<T>("DELETE", route, data, requireAuth);
