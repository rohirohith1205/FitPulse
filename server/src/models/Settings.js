import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    gymName: { type: String, default: "FitPulse Front Desk" },
    accentColor: { type: String, default: "#22c55e" },
    notifications: {
      checkIns: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      expirations: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
