import { Router } from "express";
import { signUp, login } from "../controllers/auth.controller.js";

const authRoutes = Router();

// /api/v1/auth/signup
authRoutes.post("/signup", signUp);

// /api/v1/auth/login
authRoutes.post("/login", login);

export default authRoutes;
