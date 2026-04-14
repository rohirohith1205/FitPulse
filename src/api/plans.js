import { http } from "./http";

export async function listPlans({ includeInactive = true } = {}) {
  const qs = new URLSearchParams();
  if (includeInactive) qs.set("includeInactive", "true");
  const res = await http(`/api/plans?${qs.toString()}`);
  return res.data;
}

export async function createPlan(body) {
  const res = await http("/api/plans", { method: "POST", body });
  return res.data;
}

export async function deletePlan(id) {
  const res = await http(`/api/plans/${id}`, { method: "DELETE" });
  return res.data;
}

export async function updatePlan(id, body) {
  const res = await http(`/api/plans/${id}`, { method: "PATCH", body });
  return res.data;
}

