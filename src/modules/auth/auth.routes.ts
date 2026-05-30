import { Router } from "express";
import { register, login, getMe } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, getMe);
