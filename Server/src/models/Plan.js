import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD", trim: true },
    durationDays: { type: Number, required: true, min: 1 },
    description: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

planSchema.index({ name: 1 }, { unique: true });

export const Plan = mongoose.model("Plan", planSchema);

