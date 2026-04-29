import { Router } from "express";
import { Trainer } from "../models/Trainer.js";
import { Member } from "../models/Member.js";
import { requireValidObjectId } from "../lib/validation.js";

export const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 }).lean();
    
    // Get member counts for each trainer
    const counts = await Member.aggregate([
      { $match: { trainerId: { $exists: true, $ne: null } } },
      { $group: { _id: "$trainerId", count: { $sum: 1 } } }
    ]);
    
    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const trainersWithCounts = trainers.map(t => ({
      ...t,
      assignedMembers: countMap[t._id.toString()] || 0
    }));

    res.json({ data: trainersWithCounts });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, phone, specialization } = req.body;
    if (!name?.trim()) throw new Error("Name is required");

    const trainer = await Trainer.create({ 
      name: name.trim(), 
      phone: phone?.trim(),
      specialization: specialization?.trim() 
    });
    res.status(201).json({ data: trainer });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    requireValidObjectId(req.params.id);
    const updated = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updated) {
        const err = new Error("Trainer not found");
        err.status = 404;
        throw err;
    }
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    requireValidObjectId(req.params.id);
    const membersWithTrainer = await Member.countDocuments({ trainerId: req.params.id });
    if (membersWithTrainer > 0) {
        const err = new Error("Cannot delete trainer with assigned members. Soft delete by setting active to false.");
        err.status = 400;
        throw err;
    }
    const deleted = await Trainer.findByIdAndDelete(req.params.id).lean();
    res.json({ data: deleted });
  } catch (err) {
    next(err);
  }
});
