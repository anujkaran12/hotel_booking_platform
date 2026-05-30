import mongoose, { Schema } from "mongoose";

export interface IBooking extends Document {
  customer_id: mongoose.Types.ObjectId;
  hotel_id: mongoose.Types.ObjectId;
  room_id: mongoose.Types.ObjectId;
  check_in: Date;
  check_out: Date;
  guests: number;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  cancelled_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel_id: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    room_id: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    check_in: { type: Date, required: true },
    check_out: { type: Date, required: true },
    guests: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    cancelled_at: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
