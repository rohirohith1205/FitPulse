import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    specialization: { type: String, trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Trainer = mongoose.model("Trainer", trainerSchema);
