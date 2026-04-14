import { Router } from "express";
import mongoose from "mongoose";
import { Member } from "../models/Member.js";
import { Plan } from "../models/Plan.js";
import {
  memberCreateSchema,
  memberUpdateSchema,
  requireValidObjectId,
  zodErrorToMessage
} from "../lib/validation.js";

export const router = Router();

function statusFromDates(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (expiry.getTime() < now.getTime()) return "Overdue";
  const in30Days = new Date(now);
  in30Days.setDate(in30Days.getDate() + 30);
  if (expiry.getTime() <= in30Days.getTime()) return "Expiring";
  return "Active";
}

router.get("/", async (req, res, next) => {
  try {
    const search = (req.query.search ?? "").toString().trim();
    const status = (req.query.status ?? "").toString().trim(); // Active|Expiring|Overdue
    const planId = (req.query.planId ?? "").toString().trim();
    const limit = Math.min(Number(req.query.limit ?? 50), 200);
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (planId) {
      requireValidObjectId(planId, "planId");
      filter.membershipPlanId = new mongoose.Types.ObjectId(planId);
    }

    // Status filter derived from expiryDate (so it stays consistent).
    if (status) {
      const now = new Date();
      const in30Days = new Date(now);
      in30Days.setDate(in30Days.getDate() + 30);

      if (status === "Overdue") {
        filter.expiryDate = { $lt: now };
      } else if (status === "Expiring") {
        filter.expiryDate = { $gte: now, $lte: in30Days };
      } else if (status === "Active") {
        filter.expiryDate = { $gt: in30Days };
      }
    }

    const [rows, total] = await Promise.all([
      Member.find(filter)
        .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("membershipPlanId")
        .lean(),
      Member.countDocuments(filter)
    ]);

    const data = rows.map((m) => ({
      ...m,
      status: statusFromDates(m.expiryDate),
      planName: m.membershipPlanId?.name ?? ""
    }));

    res.json({
      data,
      meta: { page, limit, total }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = memberCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error(zodErrorToMessage(parsed.error));
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    requireValidObjectId(parsed.data.membershipPlanId, "membershipPlanId");

    const plan = await Plan.findById(parsed.data.membershipPlanId).lean();
    if (!plan) {
      const err = new Error("membershipPlanId does not exist");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const created = await Member.create({
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      membershipPlanId: parsed.data.membershipPlanId,
      joinDate: new Date(parsed.data.joinDate),
      expiryDate: new Date(parsed.data.expiryDate)
    });

    const populated = await Member.findById(created._id).populate("membershipPlanId").lean();
    res.status(201).json({
      data: {
        ...populated,
        status: statusFromDates(populated.expiryDate),
        planName: populated.membershipPlanId?.name ?? ""
      }
    });
  } catch (err) {
    if (err instanceof mongoose.Error && err.code === 11000) {
      err.status = 409;
      err.code = "DUPLICATE";
      err.message = "Phone already exists";
    }
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    requireValidObjectId(req.params.id, "member id");

    const member = await Member.findById(req.params.id).populate("membershipPlanId").lean();
    if (!member) {
      const err = new Error("Member not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({
      data: {
        ...member,
        status: statusFromDates(member.expiryDate),
        planName: member.membershipPlanId?.name ?? ""
      }
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    requireValidObjectId(req.params.id, "member id");

    const parsed = memberUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error(zodErrorToMessage(parsed.error));
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    const update = { ...parsed.data };
    if (update.membershipPlanId) {
      requireValidObjectId(update.membershipPlanId, "membershipPlanId");
      const plan = await Plan.findById(update.membershipPlanId).lean();
      if (!plan) {
        const err = new Error("membershipPlanId does not exist");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        throw err;
      }
    }
    if (update.joinDate) update.joinDate = new Date(update.joinDate);
    if (update.expiryDate) update.expiryDate = new Date(update.expiryDate);

    const updated = await Member.findByIdAndUpdate(req.params.id, update, {
      new: true
    })
      .populate("membershipPlanId")
      .lean();

    if (!updated) {
      const err = new Error("Member not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({
      data: {
        ...updated,
        status: statusFromDates(updated.expiryDate),
        planName: updated.membershipPlanId?.name ?? ""
      }
    });
  } catch (err) {
    if (err instanceof mongoose.Error && err.code === 11000) {
      err.status = 409;
      err.code = "DUPLICATE";
      err.message = "Phone already exists";
    }
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    requireValidObjectId(req.params.id, "member id");

    const deleted = await Member.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      const err = new Error("Member not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({ data: deleted });
  } catch (err) {
    next(err);
  }
});

