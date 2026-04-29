import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    method: { type: String, enum: ["cash", "card", "transfer", "upi", "other"], required: true },
    paidAt: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "completed" },
    invoiceNumber: { type: String },
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
