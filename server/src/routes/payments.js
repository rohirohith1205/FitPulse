import { Router } from "express";
import { Payment } from "../models/Payment.js";
import { Member } from "../models/Member.js";
import { Plan } from "../models/Plan.js";
import { requireValidObjectId } from "../lib/validation.js";

export const router = Router();

// List all payments (optionally filter by search text)
router.get("/", async (req, res, next) => {
  try {
    const search = req.query.search;
    const method = req.query.method;
    let query = {};

    if (search) {
      const members = await Member.find({ $text: { $search: search } }).select("_id").lean();
      if (members.length > 0) {
        query.memberId = { $in: members.map(m => m._id) };
      } else {
        // No matching members — return empty
        return res.json({ data: [] });
      }
    }

    if (method && method !== "all") {
      query.method = method;
    }

    const payments = await Payment.find(query)
      .populate("memberId", "fullName email")
      .populate("planId", "name durationDays priceCents")
      .sort({ paidAt: -1 })
      .limit(200)
      .lean();

    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
});

// Get payments for a specific member
router.get("/member/:id", async (req, res, next) => {
  try {
    requireValidObjectId(req.params.id, "memberId");

    const payments = await Payment.find({ memberId: req.params.id })
      .populate("planId", "name durationDays priceCents")
      .sort({ paidAt: -1 })
      .limit(50)
      .lean();

    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
});

// Create payment — also extends membership expiry date
router.post("/", async (req, res, next) => {
  try {
    const { memberId, planId, amount, method, notes } = req.body;

    // Validate IDs
    requireValidObjectId(memberId, "memberId");

    const member = await Member.findById(memberId).populate("membershipPlanId");
    if (!member) {
      const err = new Error("Member not found");
      err.status = 404;
      throw err;
    }

    // Resolve the plan — use planId from body or fallback to member's current plan
    const resolvedPlanId = planId || member.membershipPlanId?._id;
    let plan = null;
    if (resolvedPlanId) {
      requireValidObjectId(resolvedPlanId, "planId");
      plan = await Plan.findById(resolvedPlanId).lean();
    }

    // Record the payment
    const payment = await Payment.create({
      memberId,
      planId: resolvedPlanId || undefined,
      amount: Number(amount),
      method: method.toLowerCase(),
      notes,
      status: "completed",
      membershipPlanSnapshot: {
        name: plan?.name || member.membershipPlanId?.name || "Unknown",
        price: plan?.priceCents || member.membershipPlanId?.priceCents || 0
      }
    });

    // Extend membership expiry date based on plan duration
    if (plan?.durationDays) {
      const now = new Date();
      const currentExpiry = new Date(member.expiryDate);

      // If membership is expired, extend from today; otherwise from current expiry
      const baseDate = currentExpiry.getTime() < now.getTime() ? now : currentExpiry;
      const newExpiry = new Date(baseDate);
      newExpiry.setDate(newExpiry.getDate() + plan.durationDays);

      await Member.findByIdAndUpdate(memberId, {
        expiryDate: newExpiry,
        membershipPlanId: resolvedPlanId,
        isPaid: true
      });
    }

    const populated = await Payment.findById(payment._id)
      .populate("memberId", "fullName email")
      .populate("planId", "name durationDays priceCents")
      .lean();

    res.status(201).json({ data: populated });
  } catch (err) {
    next(err);
  }
});
