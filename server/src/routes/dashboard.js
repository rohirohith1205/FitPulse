import { Router } from "express";
import { Member } from "../models/Member.js";
import { Payment } from "../models/Payment.js";

export const router = Router();

router.get("/summary", async (req, res, next) => {
  try {
    const now = new Date();
    const in30Days = new Date(now);
    in30Days.setDate(now.getDate() + 30);
    
    // Total members
    const totalMembers = await Member.countDocuments();
    
    // Active members
    const activeMembers = await Member.countDocuments({ expiryDate: { $gt: in30Days } });
    
    // Expiring this month
    const expiringMembers = await Member.countDocuments({ expiryDate: { $gte: now, $lte: in30Days } });
    
    // Monthly revenue
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenueAgg = await Payment.aggregate([
      { $match: { paidAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const monthlyRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      data: {
        totalMembers,
        activeMembers,
        expiringMembers,
        monthlyRevenue
      }
    });
  } catch (err) {
    next(err);
  }
});
