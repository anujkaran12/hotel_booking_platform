import { Booking } from "../../models/booking.model";
import { Room } from "../../models/room.model";
import { Hotel } from "../../models/hotel.model";
import { createNotification } from "../notifications/notification.service";
import { BookingStatusUpdate, CreateBookingInput } from "./booking.types";

// Create Booking
export const createBooking = async (input: CreateBookingInput) => {
  const { room_id, check_in, check_out, guests } = input;

  // check room exists
  const room = await Room.findById(room_id);
  if (!room) throw new Error("Room not found");

  // check room is available
  if (!room.is_available) {
    throw new Error("This room is not available for booking");
  }

  // check guests dont exceed capacity
  if (guests > room.capacity) {
    throw new Error(`This room can only accommodate ${room.capacity} guests`);
  }

  // check no overlapping booking exists
  const overlapping = await Booking.findOne({
    room_id,
    status: { $in: ["pending", "confirmed"] },
    $or: [{ check_in: { $lt: check_out }, check_out: { $gt: check_in } }],
  });
  if (overlapping) {
    throw new Error("This room is already booked for the selected dates");
  }

  // calculate total amount
  const nights = Math.ceil(
    (check_out.getTime() - check_in.getTime()) / (1000 * 60 * 60 * 24),
  );
  const total_amount = nights * room.price_per_night;

  const booking = await Booking.create({ ...input, total_amount });
  await createNotification({
    user_id: input.customer_id,
    title: "Booking Confirmed",
    message: `Your booking has been created successfully for ${check_in.toDateString()}`,
    type: "booking",
  });
  return booking;
};

// Get My Bookings
export const getMyBookings = async (customerId: string) => {
  const bookings = await Booking.find({ customer_id: customerId })
    .populate("hotel_id", "name city")
    .populate("room_id", "room_type price_per_night")
    .sort({ createdAt: -1 });
  return bookings;
};

// Get Booking By ID
export const getBookingById = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId)
    .populate("hotel_id", "name city address")
    .populate("room_id", "room_type price_per_night")
    .populate("customer_id", "name email phone");
  if (!booking) throw new Error("Booking not found");
  return booking;
};

// Cancel Booking
export const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    customer_id: customerId,
  });
  if (!booking) throw new Error("Booking not found");

  if (booking.status === "cancelled") {
    throw new Error("This booking is already cancelled");
  }

  if (booking.status === "completed") {
    throw new Error("Completed bookings cannot be cancelled");
  }

  booking.status = "cancelled";
  booking.cancelled_at = new Date();
  await booking.save();
  await createNotification({
    user_id: customerId,
    title: "Booking Cancelled",
    message:
      "Your booking has been cancelled. Refund will be processed shortly.",
    type: "cancellation",
  });
  return booking;
};

// Get Hotel Bookings (Seller)
export const getHotelBookings = async (hotelId: string, sellerId: string) => {
  // check hotel belongs to seller
  const hotel = await Hotel.findOne({ _id: hotelId, seller_id: sellerId });
  if (!hotel)
    throw new Error(
      "Hotel not found or you do not have permission to view its bookings",
    );

  const bookings = await Booking.find({ hotel_id: hotelId })
    .populate("customer_id", "name email phone")
    .populate("room_id", "room_type")
    .sort({ createdAt: -1 });
  return bookings;
};

// Update Booking Status (Seller - checkin/checkout)
export const updateBookingStatus = async (
  bookingId: string,
  sellerId: string,
  status: BookingStatusUpdate,
) => {
  const booking = await Booking.findById(bookingId).populate("hotel_id");
  if (!booking) throw new Error("Booking not found");

  // check seller owns the hotel
  const hotel = await Hotel.findOne({
    _id: booking.hotel_id,
    seller_id: sellerId,
  });
  if (!hotel)
    throw new Error("You do not have permission to update this booking");

  if (status === "confirmed" && booking.status !== "pending") {
    throw new Error("Only pending bookings can be checked in");
  }

  if (status === "completed" && booking.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be checked out");
  }

  booking.status = status;
  await booking.save();
  return booking;
};

// Get All Bookings (Admin)
export const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate("customer_id", "name email")
    .populate("hotel_id", "name city")
    .populate("room_id", "room_type")
    .sort({ createdAt: -1 });
  return bookings;
};
