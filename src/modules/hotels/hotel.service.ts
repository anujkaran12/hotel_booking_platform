import { Hotel } from "../../models/hotel.model";
import {
  CreateHotelInput,
  GetAllHotelsInput,
  HotelStatusUpdate,
} from "./hotel.types";

export const getAllHotels = async (filters: GetAllHotelsInput) => {
  const query: any = { status: "approved" };

  if (filters.city) query.city = new RegExp(filters.city, "i");
  if (filters.star_rating) query.star_rating = filters.star_rating;

  const hotels = await Hotel.find(query).sort({ createdAt: -1 });
  return hotels;
};

export const getHotelById = async (hotelId: string) => {
  const hotel = await Hotel.findById(hotelId).populate(
    "seller_id",
    "name email",
  );
  if (!hotel) throw new Error("Hotel not found");
  return hotel;
};

export const createHotel = async (input: CreateHotelInput) => {
  const hotel = await Hotel.create(input);
  return hotel;
};

export const updateHotel = async (
  hotelId: string,
  sellerId: string,
  updates: Partial<CreateHotelInput>,
) => {
  const hotel = await Hotel.findOne({ _id: hotelId, seller_id: sellerId });
  if (!hotel)
    throw new Error(
      "Hotel not found or you do not have permission to update it",
    );

  const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updates, {
    new: true,
  });
  return updatedHotel;
};

export const deleteHotel = async (hotelId: string, sellerId: string) => {
  const hotel = await Hotel.findOne({ _id: hotelId, seller_id: sellerId });
  if (!hotel)
    throw new Error(
      "Hotel not found or you do not have permission to delete it",
    );

  await Hotel.findByIdAndDelete(hotelId);
};

export const updateHotelStatus = async (
  hotelId: string,
  status: HotelStatusUpdate,
) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) throw new Error("Hotel not found");

  hotel.status = status;
  await hotel.save();
  return hotel;
};
