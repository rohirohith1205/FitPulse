import { http } from "./http";

export async function listTrainers() {
  const res = await http("/api/trainers");
  return res.data;
}

export async function createTrainer(body) {
  const res = await http("/api/trainers", { method: "POST", body });
  return res.data;
}

export async function updateTrainer(id, body) {
  const res = await http(`/api/trainers/${id}`, { method: "PATCH", body });
  return res.data;
}

export async function deleteTrainer(id) {
  const res = await http(`/api/trainers/${id}`, { method: "DELETE" });
  return res.data;
}
