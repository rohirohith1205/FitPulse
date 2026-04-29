import { z } from "zod";
import mongoose from "mongoose";

export function zodErrorToMessage(zodError) {
  return zodError.issues.map((i) => i.message).join("; ");
}

export function requireValidObjectId(id, fieldName = "id") {
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error(`Invalid ${fieldName}`);
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    throw err;
  }
}

export const planCreateSchema = z.object({
  name: z.string().trim().min(1, "Plan name is required"),
  priceCents: z.number().int().min(0),
  currency: z.string().trim().min(1).default("USD").optional(),
  durationDays: z.number().int().min(1),
  description: z.string().trim().max(500).optional(),
  active: z.boolean().optional()
});

export const planUpdateSchema = planCreateSchema.partial();

export const memberCreateSchema = z.object({
  fullName: z.string().trim().min(1, "Member name is required"),
  email: z.string().trim().email("Valid email is required"),
  membershipPlanId: z.string().trim().min(1, "membershipPlanId is required"),
  trainerId: z.string().trim().optional(),
  joinDate: z.string().trim().min(1),
  expiryDate: z.string().trim().min(1)
});

export const memberUpdateSchema = memberCreateSchema.partial();

