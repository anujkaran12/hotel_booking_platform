import { Room } from "../../models/room.model";
import { Hotel } from "../../models/hotel.model";
import { CreateRoomInput } from "./room.types";

// Get All Rooms By Hotel
export const getRoomsByHotel = async (hotelId: string) => {
  // check hotel exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) throw new Error("Hotel not found");

  const rooms = await Room.find({ hotel_id: hotelId, is_available: true });
  return rooms;
};

// Get Room By ID
export const getRoomById = async (roomId: string) => {
  const room = await Room.findById(roomId).populate(
    "hotel_id",
    "name city address",
  );
  if (!room) throw new Error("Room not found");
  return room;
};

// Create Room
export const createRoom = async (input: CreateRoomInput) => {
  // check hotel exists and belongs to this seller
  const hotel = await Hotel.findById(input.hotel_id);
  if (!hotel) throw new Error("Hotel not found");

  // check hotel is approved
  if (hotel.status !== "approved") {
    throw new Error("You can only add rooms to an approved hotel");
  }

  const room = await Room.create(input);
  return room;
};

// Update Room
export const updateRoom = async (
  roomId: string,
  sellerId: string,
  updates: Partial<CreateRoomInput>,
) => {
  // check room exists
  const room = await Room.findById(roomId).populate("hotel_id");
  if (!room) throw new Error("Room not found");

  // check seller owns this hotel
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

// Delete Room
export const deleteRoom = async (roomId: string, sellerId: string) => {
  // check room exists
  const room = await Room.findById(roomId).populate("hotel_id");
  if (!room) throw new Error("Room not found");

  // check seller owns this hotel
  const hotel = await Hotel.findOne({
    _id: room.hotel_id,
    seller_id: sellerId,
  });
  if (!hotel) throw new Error("You do not have permission to delete this room");

  await Room.findByIdAndDelete(roomId);
};
