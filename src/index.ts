import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { authRoutes } from "./modules/auth/auth.routes";
import { hotelRoutes } from "./modules/hotels/hotel.routes";
import { roomRoutes } from "./modules/rooms/room.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { notificationRoutes } from "./modules/notifications/notification.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";
import { generalLimiter } from "./middlewares/rateLimit.middleware";
import { successResponse } from "./utils/apiResponse";

export const app = express();

app.use(express.json());
app.use(generalLimiter);

app.get("/", (req, res) => {
  successResponse(
    res,
    200,
    "Hotle Booking Platform Management Backend is live now",
  );
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hotel", hotelRoutes);
app.use("/api/v1", roomRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/payments", paymentRoutes);

mongoose
  .connect(process.env.MONGO_URL as string, {
    dbName: "hotel_booking_platform",
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log(err));
