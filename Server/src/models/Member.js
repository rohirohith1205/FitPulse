import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    membershipPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },
    joinDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true }
  },
  { timestamps: true }
);

memberSchema.index({ phone: 1 }, { unique: true });
memberSchema.index({ fullName: "text", phone: "text", email: "text" });
memberSchema.index({ expiryDate: 1 });

export const Member = mongoose.model("Member", memberSchema);

