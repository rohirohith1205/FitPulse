import { http } from "./http";

export async function getSettings() {
  const res = await http("/api/settings");
  return res.data;
}

export async function updateSettings(body) {
  const res = await http("/api/settings", { method: "PATCH", body });
  return res.data;
}
