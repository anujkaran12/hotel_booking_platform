import { Request, Response } from "express";
import * as paymentService from "./payment.service";
import {
  errorResponse,
  successResponse,
  validationResponse,
} from "../../utils/apiResponse";
import { getAuthUser, getParam } from "../../utils/request";
import { requiredFields } from "../../utils/validation";

export const initiatePayment = async (
  req: Request,
  res: Response,
) => {
  try {
    const { booking_id, gateway } = req.body;

    const errors = requiredFields(req.body, {
      booking_id: "Booking ID is required",
      gateway: "Payment gateway is required",
    });

    if (gateway && !["razorpay", "stripe"].includes(gateway)) {
      errors.push({
        field: "gateway",
        message: "Gateway must be razorpay or stripe",
      });
    }

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await paymentService.initiatePayment({
      booking_id,
      user_id: getAuthUser(req).id,
      gateway,
    });

    successResponse(res, 200, "Payment initiated successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
) => {
  try {
    const { booking_id, gateway_order_id, gateway_payment_id, signature } =
      req.body;

    const errors = requiredFields(req.body, {
      booking_id: "Booking ID is required",
      gateway_order_id: "Gateway order ID is required",
      gateway_payment_id: "Gateway payment ID is required",
      signature: "Payment signature is required",
    });

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await paymentService.verifyPayment({
      booking_id,
      gateway_order_id,
      gateway_payment_id,
      signature,
    });

    successResponse(res, 200, "Payment verified successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const refundPayment = async (
  req: Request,
  res: Response,
) => {
  try {
    const errors = requiredFields(req.body, {
      booking_id: "Booking ID is required",
    });

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await paymentService.refundPayment(
      req.body.booking_id,
      getAuthUser(req).id,
    );

    successResponse(res, 200, "Refund initiated successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const getPaymentByBooking = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await paymentService.getPaymentByBooking(
      getParam(req, "bookingId"),
      getAuthUser(req).id,
    );

    successResponse(res, 200, "Payment details fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 404, err.message);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    if (typeof signature !== "string") {
      errorResponse(res, 400, "Webhook signature is missing");
      return;
    }

    await paymentService.handleWebhook(req.body, signature);
    successResponse(res, 200, "Webhook received successfully");
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};
