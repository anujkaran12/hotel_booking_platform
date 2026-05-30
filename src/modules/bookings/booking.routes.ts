import { Router } from "express";
import * as bookingController from "./booking.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const bookingRoutes = Router();

// customer
bookingRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware("customer"),
  bookingController.createBooking,
);
bookingRoutes.get(
  "/my-bookings",
  authMiddleware,
  roleMiddleware("customer"),
  bookingController.getMyBookings,
);
bookingRoutes.get(
  "/:id",
  authMiddleware,
  roleMiddleware("customer", "seller", "admin"),
  bookingController.getBookingById,
);
bookingRoutes.patch(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("customer"),
  bookingController.cancelBooking,
);

// seller

bookingRoutes.get(
  "/hotel/:hotelId",
  authMiddleware,
  roleMiddleware("seller"),
  bookingController.getHotelBookings,
);
bookingRoutes.patch(
  "/:id/checkin",
  authMiddleware,
  roleMiddleware("seller"),
  bookingController.checkIn,
);
bookingRoutes.patch(
  "/:id/checkout",
  authMiddleware,
  roleMiddleware("seller"),
  bookingController.checkOut,
);

// admin
bookingRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  bookingController.getAllBookings,
);
