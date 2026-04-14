import { Router } from "express";
import mongoose from "mongoose";
import { Plan } from "../models/Plan.js";
import { planCreateSchema, planUpdateSchema, zodErrorToMessage } from "../lib/validation.js";

export const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const filter = includeInactive ? {} : { active: true };
    const plans = await Plan.find(filter).sort({ durationDays: 1, priceCents: 1 }).lean();
    res.json({ data: plans });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = planCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error(zodErrorToMessage(parsed.error));
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const created = await Plan.create(parsed.data);
    res.status(201).json({ data: created });
  } catch (err) {
    if (err instanceof mongoose.Error && err.code === 11000) {
      err.status = 409;
      err.code = "DUPLICATE";
      err.message = "Plan name already exists";
    }
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Invalid plan id");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) {
      const err = new Error("Plan not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({ data: plan });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Invalid plan id");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const parsed = planUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error(zodErrorToMessage(parsed.error));
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const updated = await Plan.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true
    }).lean();

    if (!updated) {
      const err = new Error("Plan not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({ data: updated });
  } catch (err) {
    if (err instanceof mongoose.Error && err.code === 11000) {
      err.status = 409;
      err.code = "DUPLICATE";
      err.message = "Plan name already exists";
    }
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Invalid plan id");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const deleted = await Plan.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      const err = new Error("Plan not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({ data: deleted });
  } catch (err) {
    next(err);
  }
});

