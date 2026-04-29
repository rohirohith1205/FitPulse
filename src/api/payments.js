import { http } from "./http";

export async function listPayments(search = "") {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await http(`/api/payments${qs}`);
  return res.data;
}

export async function createPayment(body) {
  const res = await http("/api/payments", { method: "POST", body });
  return res.data;
}
