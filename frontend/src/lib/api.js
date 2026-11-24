import axios from "axios";

export const api = axios.create({ baseURL: "/api", withCredentials: true });

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.startsWith("/login")) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (error, fallback = "משהו השתבש, נסה שוב") => {
  if (!error?.response) return "אין חיבור לשרת. בדוק את החיבור ונסה שוב";
  const data = error.response.data;
  if (data && typeof data === "object" && data.message) return data.message;
  return fallback;
};

// Streams an NDJSON response (the status sender reports each agent live).
export async function streamJson(url, body, onEvent) {
  const response = await fetch(`/api${url}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
    body: JSON.stringify(body),
  });

  if (response.status === 401) onUnauthorized();
  if (!response.ok) {
    let message = "השליחה נכשלה";
    try {
      message = (await response.json()).message || message;
    } catch {
      /* not json */
    }
    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let last = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      last = JSON.parse(line);
      onEvent(last);
    }
  }
  if (buffer.trim()) {
    last = JSON.parse(buffer);
    onEvent(last);
  }
  return last;
}
