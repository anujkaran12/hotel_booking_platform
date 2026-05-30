import { Router } from "express";
import * as hotelController from "./hotel.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const hotelRoutes = Router();

// public
hotelRoutes.get("/", hotelController.getAllHotels);
hotelRoutes.get("/:id", hotelController.getHotelById);

// seller only
hotelRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware("seller"),
  hotelController.createHotel,
);
hotelRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware("seller"),
  hotelController.updateHotel,
);
hotelRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("seller"),
  hotelController.deleteHotel,
);

// admin only
hotelRoutes.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  hotelController.approveHotel,
);
hotelRoutes.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  hotelController.rejectHotel,
);
