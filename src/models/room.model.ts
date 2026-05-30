import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
export interface IRoom extends Document {
  hotel_id: mongoose.Types.ObjectId;
  room_type: string;
  price_per_night: number;
  capacity: number;
  total_rooms: number;
  amenities: string[];
  images: string[];
  is_available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    hotel_id: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    room_type: { type: String, required: true },
    price_per_night: { type: Number, required: true },
    capacity: { type: Number, required: true },
    total_rooms: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    is_available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Room = mongoose.model<IRoom>("Room", roomSchema);
