import { Request, Response } from "express";
import * as bookingService from "./booking.service";
import {
  errorResponse,
  successResponse,
  validationResponse,
} from "../../utils/apiResponse";
import { getAuthUser, getParam } from "../../utils/request";
import { positiveNumberError, requiredFields } from "../../utils/validation";

export const createBooking = async (
  req: Request,
  res: Response,
) => {
  try {
    const { hotel_id, room_id, check_in, check_out, guests } = req.body;

    const errors = requiredFields(req.body, {
      hotel_id: "Hotel is required",
      room_id: "Room is required",
      check_in: "Check in date is required",
      check_out: "Check out date is required",
      guests: "Number of guests is required",
    });

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (check_in && checkInDate < today) {
      errors.push({
        field: "check_in",
        message: "Check in date must be today or a future date",
      });
    }

    if (check_in && check_out && checkOutDate <= checkInDate) {
      errors.push({
        field: "check_out",
        message: "Check out date must be after check in date",
      });
    }

    errors.push(
      ...positiveNumberError(
        guests,
        "guests",
        "Number of guests must be greater than 0",
      ),
    );

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await bookingService.createBooking({
      customer_id: getAuthUser(req).id,
      hotel_id,
      room_id,
      check_in: checkInDate,
      check_out: checkOutDate,
      guests,
    });

    successResponse(res, 201, "Booking created successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await bookingService.getMyBookings(getAuthUser(req).id);
    successResponse(res, 200, "Bookings fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 500, err.message);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await bookingService.getBookingById(getParam(req, "id"));
    successResponse(res, 200, "Booking fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 404, err.message);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await bookingService.cancelBooking(
      getParam(req, "id"),
      getAuthUser(req).id,
    );

    successResponse(res, 200, "Booking cancelled successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const getHotelBookings = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await bookingService.getHotelBookings(
      getParam(req, "hotelId"),
      getAuthUser(req).id,
    );

    successResponse(res, 200, "Hotel bookings fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const checkIn = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.updateBookingStatus(
      getParam(req, "id"),
      getAuthUser(req).id,
      "confirmed",
    );

    successResponse(res, 200, "Guest checked in successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.updateBookingStatus(
      getParam(req, "id"),
      getAuthUser(req).id,
      "completed",
    );

    successResponse(res, 200, "Guest checked out successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await bookingService.getAllBookings();
    successResponse(res, 200, "All bookings fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 500, err.message);
  }
};
