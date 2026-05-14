import axios from "axios";

export class HttpError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function http(path, { method = "GET", body, headers } = {}) {
  try {
    const res = await apiClient({
      url: path,
      method,
      data: body,
      headers,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      const payload = error.response.data;
      const message = payload?.error?.message ?? payload?.error ?? `Request failed (${error.response.status})`;
      throw new HttpError(message, {
        status: error.response.status,
        code: payload?.error?.code,
      });
    }
    throw new HttpError(error.message, { status: 500 });
  }
}
