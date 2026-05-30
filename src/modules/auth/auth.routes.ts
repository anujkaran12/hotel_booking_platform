import { Router } from "express";
import { register, login, getMe } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authLimiter } from "../../middlewares/rateLimit.middleware";

export const authRoutes = Router();

authRoutes.post("/register", authLimiter, register);
authRoutes.post("/login", authLimiter, login);
authRoutes.get("/me", authMiddleware, getMe);
