export class HttpError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

export async function http(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include"
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = payload?.error?.message ?? `Request failed (${res.status})`;
    throw new HttpError(message, {
      status: res.status,
      code: payload?.error?.code
    });
  }

  return payload;
}

