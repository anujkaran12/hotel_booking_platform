import { Request, Response } from "express";
import * as roomService from "./room.service";
import {
  errorResponse,
  successResponse,
  validationResponse,
} from "../../utils/apiResponse";
import { getAuthUser, getParam } from "../../utils/request";
import { positiveNumberError, requiredFields } from "../../utils/validation";

export const getRoomsByHotel = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await roomService.getRoomsByHotel(getParam(req, "hotelId"));
    successResponse(res, 200, "Rooms fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 500, err.message);
  }
};

export const getRoomById = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await roomService.getRoomById(getParam(req, "id"));
    successResponse(res, 200, "Room fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 404, err.message);
  }
};

export const createRoom = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      room_type,
      price_per_night,
      capacity,
      total_rooms,
      amenities,
      images,
    } = req.body;

    const errors = [
      ...requiredFields(req.body, {
        room_type: "Room type is required",
        price_per_night: "Price per night is required",
        capacity: "Capacity is required",
        total_rooms: "Total rooms is required",
      }),
      ...positiveNumberError(
        price_per_night,
        "price_per_night",
        "Price per night must be greater than 0",
      ),
      ...positiveNumberError(
        capacity,
        "capacity",
        "Capacity must be greater than 0",
      ),
      ...positiveNumberError(
        total_rooms,
        "total_rooms",
        "Total rooms must be greater than 0",
      ),
    ];

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await roomService.createRoom({
      hotel_id: getParam(req, "hotelId"),
      room_type,
      price_per_night,
      capacity,
      total_rooms,
      amenities,
      images,
    });

    successResponse(res, 201, "Room created successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const updateRoom = async (
  req: Request,
  res: Response,
) => {
  try {
    const { price_per_night, capacity, total_rooms } = req.body;

    const errors = [
      ...positiveNumberError(
        price_per_night,
        "price_per_night",
        "Price per night must be greater than 0",
      ),
      ...positiveNumberError(
        capacity,
        "capacity",
        "Capacity must be greater than 0",
      ),
      ...positiveNumberError(
        total_rooms,
        "total_rooms",
        "Total rooms must be greater than 0",
      ),
    ];

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await roomService.updateRoom(
      getParam(req, "id"),
      getAuthUser(req).id,
      req.body,
    );

    successResponse(res, 200, "Room updated successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const deleteRoom = async (
  req: Request,
  res: Response,
) => {
  try {
    await roomService.deleteRoom(getParam(req, "id"), getAuthUser(req).id);
    successResponse(res, 200, "Room deleted successfully");
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};
