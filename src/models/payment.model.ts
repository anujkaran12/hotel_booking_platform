import mongoose, { Schema } from "mongoose";

export interface IPayment extends Document {
  booking_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  gateway: "razorpay" | "stripe";
  gateway_order_id: string;
  gateway_payment_id: string | null;
  status: "pending" | "success" | "failed" | "refunded";
  refund_id: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    booking_id: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    gateway: { type: String, enum: ["razorpay", "stripe"], required: true },
    gateway_order_id: { type: String, required: true },
    gateway_payment_id: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    refund_id: { type: String, default: null },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
