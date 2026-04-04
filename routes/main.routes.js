import { Router } from "express";
import authRoutes from "./auth.routes.js";

const mainRoutes = Router();

// Auth Routes
mainRoutes.use("/auth", authRoutes);

export default mainRoutes;
