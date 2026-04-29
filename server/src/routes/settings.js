import { Router } from "express";
import { Settings } from "../models/Settings.js";

export const router = Router();

router.get("/", async (req, res, next) => {
  try {
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const update = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    Object.assign(settings, update);
    await settings.save();
    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
});
