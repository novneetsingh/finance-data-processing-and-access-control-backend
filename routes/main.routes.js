import { Router } from "express";
import authRoutes from "./auth.routes.js";
import transactionRoutes from "./transaction.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import userRoutes from "./user.routes.js";
import { apiLimiter, authLimiter } from "../middlewares/rateLimiter.js";

const mainRoutes = Router();

// Auth Routes (Stricter limiting)
mainRoutes.use("/auth", authLimiter, authRoutes);

// Transaction Routes
mainRoutes.use("/transactions", apiLimiter, transactionRoutes);

// Dashboard Routes
mainRoutes.use("/dashboard", apiLimiter, dashboardRoutes);

// User Management Routes
mainRoutes.use("/users", apiLimiter, userRoutes);

export default mainRoutes;
