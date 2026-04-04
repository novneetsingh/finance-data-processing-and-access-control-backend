import { Router } from "express";
import authRoutes from "./auth.routes.js";
import transactionRoutes from "./transaction.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import userRoutes from "./user.routes.js";

const mainRoutes = Router();

// Auth Routes
mainRoutes.use("/auth", authRoutes);

// Transaction Routes
mainRoutes.use("/transactions", transactionRoutes);

// Dashboard Routes
mainRoutes.use("/dashboard", dashboardRoutes);

// User Management Routes
mainRoutes.use("/users", userRoutes);

export default mainRoutes;
