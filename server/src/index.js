import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectToDb } from "./lib/db.js";
import { notFoundHandler, errorHandler } from "./middleware/errors.js";
import { router as healthRouter } from "./routes/health.js";
import { router as plansRouter } from "./routes/plans.js";
import { router as membersRouter } from "./routes/members.js";
import { router as authRouter } from "./routes/auth.js";
import { router as trainersRouter } from "./routes/trainers.js";
import { router as paymentsRouter } from "./routes/payments.js";
import { router as settingsRouter } from "./routes/settings.js";
import { router as dashboardRouter } from "./routes/dashboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we load `server/.env` even when started from repo root.
dotenv.config({ path: path.resolve(__dirname, "../.env") });


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? true,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/plans", plansRouter);
app.use("/api/members", membersRouter);
app.use("/api/trainers", trainersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 5000);

await connectToDb(process.env.MONGODB_URI);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});

