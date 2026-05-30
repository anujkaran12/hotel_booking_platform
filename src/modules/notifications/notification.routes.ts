import { Router } from "express";
import * as notificationController from "./notification.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const notificationRoutes = Router();

// all authenticated users
notificationRoutes.get("/", authMiddleware, notificationController.getMyNotifications);
notificationRoutes.patch("/:id/read", authMiddleware, notificationController.markAsRead);
notificationRoutes.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllAsRead,
);
notificationRoutes.delete(
  "/:id",
  authMiddleware,
  notificationController.deleteNotification,
);
