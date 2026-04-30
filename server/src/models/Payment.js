import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    method: { type: String, enum: ["cash", "upi", "card", "transfer", "other"], required: true },
    paidAt: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "completed" },
    notes: { type: String },
    membershipPlanSnapshot: {
      name: String,
      price: Number
    }
  },
  { timestamps: true }
);

paymentSchema.index({ paidAt: -1 });
paymentSchema.index({ memberId: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
