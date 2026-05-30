export type PaymentGateway = "razorpay" | "stripe";

export interface InitiatePaymentInput {
  booking_id: string;
  user_id: string;
  gateway: PaymentGateway;
}

export interface VerifyPaymentInput {
  booking_id: string;
  gateway_order_id: string;
  gateway_payment_id: string;
  signature: string;
}
