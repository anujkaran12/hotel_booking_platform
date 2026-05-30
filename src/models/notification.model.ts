import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "booking" | "payment" | "cancellation" | "general";
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["booking", "payment", "cancellation", "general"],
      required: true,
    },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
