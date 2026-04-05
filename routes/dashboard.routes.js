import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/roleCheck.js";
import {
  getSummary,
  getRecentActivity,
  getCategoryBreakdown,
  getTrends,
} from "../controllers/dashboard.controller.js";

const dashboardRoutes = Router();

// All authenticated roles can access summary and recent activity

// /api/v1/dashboard/summary
dashboardRoutes.get(
  "/summary",
  auth,
  authorize("Viewer", "Analyst", "Admin"),
  getSummary,
);

// /api/v1/dashboard/recent
dashboardRoutes.get(
  "/recent",
  auth,
  authorize("Analyst", "Admin"),
  getRecentActivity,
);

// Analyst and Admin only

// /api/v1/dashboard/categories
dashboardRoutes.get(
  "/categories",
  auth,
  authorize("Analyst", "Admin"),
  getCategoryBreakdown,
);

// /api/v1/dashboard/trends
dashboardRoutes.get("/trends", auth, authorize("Analyst", "Admin"), getTrends);

export default dashboardRoutes;
