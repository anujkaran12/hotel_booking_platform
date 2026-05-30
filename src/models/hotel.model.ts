import mongoose, { Document, Schema } from "mongoose";

export interface IHotel extends Document {
  seller_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  city: string;
  address: string;
  star_rating: number;
  status: "pending" | "approved" | "rejected";
  amenities: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const hotelSchema = new Schema<IHotel>(
  {
    seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },
    star_rating: { type: Number, min: 1, max: 5 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true },
);

export const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);
