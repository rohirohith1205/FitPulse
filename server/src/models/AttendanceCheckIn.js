import mongoose from "mongoose";

const attendanceCheckInSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    checkInAt: { type: Date, required: true, default: Date.now },
    source: { type: String, enum: ["manual", "qr"], default: "manual" },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }
  },
  { timestamps: true }
);

attendanceCheckInSchema.index({ checkInAt: 1 });
attendanceCheckInSchema.index({ memberId: 1, checkInAt: -1 });

export const AttendanceCheckIn = mongoose.model("AttendanceCheckIn", attendanceCheckInSchema);
