import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/roleCheck.js";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} from "../controllers/user.controller.js";

const userRoutes = Router();

// All Admin only

// /api/v1/users
userRoutes.get("/", auth, authorize("Admin"), getAllUsers);

// /api/v1/users/:id/role
userRoutes.patch("/:id/role", auth, authorize("Admin"), updateUserRole);

// /api/v1/users/:id/status
userRoutes.patch("/:id/status", auth, authorize("Admin"), updateUserStatus);

export default userRoutes;
