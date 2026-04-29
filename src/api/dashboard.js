import { http } from "./http";

export async function getDashboardSummary() {
  const res = await http("/api/dashboard/summary");
  return res.data;
}
