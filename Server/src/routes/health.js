import { Router } from "express";
import mongoose from "mongoose";

export const router = Router();

router.get("/", (req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1 ? "connected" : "not_connected"
  });
});

