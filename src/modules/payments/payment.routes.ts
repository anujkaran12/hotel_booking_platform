import { Router } from "express";
import * as paymentController from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const paymentRoutes = Router();

// customer
paymentRoutes.post(
  "/initiate",
  authMiddleware,
  roleMiddleware("customer"),
  paymentController.initiatePayment,
);
paymentRoutes.post(
  "/verify",
  authMiddleware,
  roleMiddleware("customer"),
  paymentController.verifyPayment,
);
paymentRoutes.post(
  "/refund",
  authMiddleware,
  roleMiddleware("customer"),
  paymentController.refundPayment,
);
paymentRoutes.get(
  "/:bookingId",
  authMiddleware,
  paymentController.getPaymentByBooking,
);

// webhook — no auth (verified by signature)
paymentRoutes.post("/webhook", paymentController.handleWebhook);
