import { Router } from "express";
import * as paymentController from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { paymentLimiter } from "../../middlewares/rateLimit.middleware";

export const paymentRoutes = Router();

// customer
paymentRoutes.post(
  "/initiate",
  paymentLimiter,
  authMiddleware,
  roleMiddleware("customer"),
  paymentController.initiatePayment,
);
paymentRoutes.post(
  "/verify",
  paymentLimiter,
  authMiddleware,
  roleMiddleware("customer"),
  paymentController.verifyPayment,
);
paymentRoutes.post(
  "/refund",
  paymentLimiter,
  authMiddleware,
  roleMiddleware("customer"),
  paymentController.refundPayment,
);
paymentRoutes.get(
  "/:bookingId",
  authMiddleware,
  paymentController.getPaymentByBooking,
);

// webhook: no auth because Razorpay verifies using signature
paymentRoutes.post("/webhook", paymentLimiter, paymentController.handleWebhook);
