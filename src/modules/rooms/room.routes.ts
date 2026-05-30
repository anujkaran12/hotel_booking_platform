import { Router } from "express";
import * as roomController from "./room.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const roomRoutes = Router();

// public
roomRoutes.get("/hotels/:hotelId/rooms", roomController.getRoomsByHotel);
roomRoutes.get("/rooms/:id", roomController.getRoomById);

// seller only
roomRoutes.post(
  "/hotels/:hotelId/rooms",
  authMiddleware,
  roleMiddleware("seller"),
  roomController.createRoom,
);
roomRoutes.put(
  "/rooms/:id",
  authMiddleware,
  roleMiddleware("seller"),
  roomController.updateRoom,
);
roomRoutes.delete(
  "/rooms/:id",
  authMiddleware,
  roleMiddleware("seller"),
  roomController.deleteRoom,
);
