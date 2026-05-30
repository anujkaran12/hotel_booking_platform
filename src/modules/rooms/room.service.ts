import { Room } from "../../models/room.model";
import { Hotel } from "../../models/hotel.model";
import { CreateRoomInput } from "./room.types";

export const getRoomsByHotel = async (hotelId: string) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) throw new Error("Hotel not found");

  const rooms = await Room.find({ hotel_id: hotelId, is_available: true });
  return rooms;
};

export const getRoomById = async (roomId: string) => {
  const room = await Room.findById(roomId).populate(
    "hotel_id",
    "name city address",
  );
  if (!room) throw new Error("Room not found");
  return room;
};

export const createRoom = async (input: CreateRoomInput) => {
  const hotel = await Hotel.findById(input.hotel_id);
  if (!hotel) throw new Error("Hotel not found");

  if (hotel.status !== "approved") {
    throw new Error("You can only add rooms to an approved hotel");
  }

  const room = await Room.create(input);
  return room;
};

export const updateRoom = async (
  roomId: string,
  sellerId: string,
  updates: Partial<CreateRoomInput>,
) => {
  const room = await Room.findById(roomId).populate("hotel_id");
  if (!room) throw new Error("Room not found");

  const hotel = await Hotel.findOne({
    _id: room.hotel_id,
    seller_id: sellerId,
  });
  if (!hotel) throw new Error("You do not have permission to update this room");

  const updatedRoom = await Room.findByIdAndUpdate(roomId, updates, {
    new: true,
  });
  return updatedRoom;
};

export const deleteRoom = async (roomId: string, sellerId: string) => {
  const room = await Room.findById(roomId).populate("hotel_id");
  if (!room) throw new Error("Room not found");

  const hotel = await Hotel.findOne({
    _id: room.hotel_id,
    seller_id: sellerId,
  });
  if (!hotel) throw new Error("You do not have permission to delete this room");

  await Room.findByIdAndDelete(roomId);
};
