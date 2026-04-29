import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

export const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_me_in_prod";

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // For demo purposes, auto-create a user if none exist, so login works.
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        const hash = await bcrypt.hash("password", 10);
        await User.create({ email: "admin@fitpulse.com", passwordHash: hash, role: "admin" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ data: { user: { id: user._id, email: user.email, role: user.role }, token } });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ data: { success: true } });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ data: { id: req.user._id, email: req.user.email, role: req.user.role } });
});
