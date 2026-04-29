import { Router } from "express";
import { Payment } from "../models/Payment.js";
import { Member } from "../models/Member.js";
import { requireValidObjectId } from "../lib/validation.js";

export const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const search = req.query.search;
    let query = {};
    if (search) {
      // Find members by name first, if we want to search by member
      const members = await Member.find({ $text: { $search: search } }).select("_id").lean();
      if (members.length > 0) {
        query.memberId = { $in: members.map(m => m._id) };
      }
    }
    
    const payments = await Payment.find(query)
      .populate("memberId", "fullName email")
      .sort({ paidAt: -1 })
      .limit(100)
      .lean();
    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { memberId, amount, method, notes } = req.body;
    requireValidObjectId(memberId, "memberId");
    
    const member = await Member.findById(memberId).populate("membershipPlanId");
    if (!member) throw new Error("Member not found");

    const payment = await Payment.create({
      memberId,
      amount,
      method,
      notes,
      membershipPlanSnapshot: {
        name: member.membershipPlanId?.name,
        price: member.membershipPlanId?.priceCents
      }
    });

    res.status(201).json({ data: payment });
  } catch (err) {
    next(err);
  }
});
