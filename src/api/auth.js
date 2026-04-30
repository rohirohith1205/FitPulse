import { http } from "./http";

export async function register(name, email, password) {
  const res = await http("/api/auth/register", { method: "POST", body: { name, email, password } });
  return res.data;
}

export async function login(email, password) {
  const res = await http("/api/auth/login", { method: "POST", body: { email, password } });
  return res.data;
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function getProfile() {
  const res = await http("/api/auth/profile");
  return res.data;
}
