import { http } from "./http";

export async function listMembers({
  search = "",
  status = "",
  planId = "",
  page,
  limit
} = {}) {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (status) qs.set("status", status);
  if (planId) qs.set("planId", planId);
  if (page) qs.set("page", String(page));
  if (limit) qs.set("limit", String(limit));
  const res = await http(`/api/members?${qs.toString()}`);
  return {
    data: res.data?.data ?? [],
    meta: res.data?.meta ?? null
  };
}

export async function createMember(body) {
  const res = await http("/api/members", { method: "POST", body });
  return res.data;
}

export async function deleteMember(id) {
  const res = await http(`/api/members/${id}`, { method: "DELETE" });
  return res.data;
}

export async function updateMember(id, body) {
  const res = await http(`/api/members/${id}`, { method: "PATCH", body });
  return res.data;
}

