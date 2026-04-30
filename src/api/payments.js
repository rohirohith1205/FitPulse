import { http } from "./http";

export async function listPayments({ search, method } = {}) {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (method) qs.set("method", method);
  const q = qs.toString();
  const res = await http(`/api/payments${q ? `?${q}` : ""}`);
  return res.data;
}

export async function listMemberPayments(memberId) {
  const res = await http(`/api/payments/member/${memberId}`);
  return res.data;
}

export async function createPayment(body) {
  const res = await http("/api/payments", { method: "POST", body });
  return res.data;
}
