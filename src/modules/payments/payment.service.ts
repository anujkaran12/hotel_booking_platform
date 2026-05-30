import Razorpay from "razorpay";
import crypto from "crypto";
import { Payment } from "../../models/payment.model";
import { Booking } from "../../models/booking.model";
import { createNotification } from "../notifications/notification.service";
import { InitiatePaymentInput, VerifyPaymentInput } from "./payment.types";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const initiatePayment = async (input: InitiatePaymentInput) => {
  const { booking_id, user_id, gateway } = input;

  const booking = await Booking.findOne({
    _id: booking_id,
    customer_id: user_id,
  });
  if (!booking) throw new Error("Booking not found");

  const existingPayment = await Payment.findOne({
    booking_id,
    status: "success",
  });
  if (existingPayment) throw new Error("This booking is already paid");

  if (booking.status === "cancelled") {
    throw new Error("Cannot make payment for a cancelled booking");
  }

  const order = await razorpay.orders.create({
    amount: booking.total_amount * 100, // razorpay takes amount in paise
    currency: "INR",
    receipt: booking_id,
  });

  const payment = await Payment.create({
    booking_id,
    user_id,
    amount: booking.total_amount,
    currency: "INR",
    gateway,
    gateway_order_id: order.id,
    status: "pending",
  });

  await createNotification({
    user_id: payment.user_id.toString(),
    title: "Payment Successful",
    message: `Your payment of ₹${payment.amount} was successful`,
    type: "payment",
  });

  return {
    payment_id: payment._id,
    gateway_order_id: order.id,
    amount: booking.total_amount,
    currency: "INR",
    key: process.env.RAZORPAY_KEY_ID,
  };
};

export const verifyPayment = async (input: VerifyPaymentInput) => {
  const { booking_id, gateway_order_id, gateway_payment_id, signature } = input;

  const body = gateway_order_id + "|" + gateway_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    throw new Error("Invalid payment signature, payment verification failed");
  }

  const payment = await Payment.findOneAndUpdate(
    { booking_id, gateway_order_id },
    { gateway_payment_id, status: "success" },
    { new: true },
  );
  if (!payment) throw new Error("Payment record not found");

  await Booking.findByIdAndUpdate(booking_id, { status: "confirmed" });

  return payment;
};

export const refundPayment = async (booking_id: string, user_id: string) => {
  const payment = await Payment.findOne({
    booking_id,
    user_id,
    status: "success",
  });
  if (!payment) throw new Error("No successful payment found for this booking");

  const booking = await Booking.findById(booking_id);
  if (!booking) throw new Error("Booking not found");

  if (booking.status !== "cancelled") {
    throw new Error("Refund is only allowed for cancelled bookings");
  }

  const refund = await razorpay.payments.refund(
    payment.gateway_payment_id as string,
    { amount: payment.amount * 100 },
  );

  payment.status = "refunded";
  payment.refund_id = refund.id;
  await payment.save();

  await createNotification({
    user_id: user_id,
    title: "Refund Initiated",
    message: `Your refund of ₹${payment.amount} has been initiated successfully`,
    type: "payment",
  });

  return payment;
};

export const getPaymentByBooking = async (
  booking_id: string,
  user_id: string,
) => {
  const payment = await Payment.findOne({ booking_id })
    .populate("booking_id", "check_in check_out status total_amount")
    .populate("user_id", "name email");

  if (!payment) throw new Error("Payment not found for this booking");
  return payment;
};

export const handleWebhook = async (body: any, signature: string) => {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET as string)
    .update(JSON.stringify(body))
    .digest("hex");

  if (expected !== signature) {
    throw new Error("Invalid webhook signature");
  }

  const event = body.event;

  if (event === "payment.failed") {
    const { order_id } = body.payload.payment.entity;
    await Payment.findOneAndUpdate(
      { gateway_order_id: order_id },
      { status: "failed" },
    );
  }

  if (event === "refund.processed") {
    const { id: refund_id, payment_id } = body.payload.refund.entity;
    await Payment.findOneAndUpdate(
      { gateway_payment_id: payment_id },
      { status: "refunded", refund_id },
    );
  }
};
