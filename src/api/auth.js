import { http } from "./http";

export async function login(email, password) {
  const res = await http("/api/auth/login", { method: "POST", body: { email, password } });
  return res.data;
}

export async function logout() {
  const res = await http("/api/auth/logout", { method: "POST" });
  return res.data;
}

export async function getMe() {
  const res = await http("/api/auth/me");
  return res.data;
}
