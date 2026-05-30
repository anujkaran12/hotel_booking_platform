import { Request, Response } from "express";
import * as hotelService from "./hotel.service";
import {
  errorResponse,
  successResponse,
  validationResponse,
} from "../../utils/apiResponse";
import { getAuthUser, getParam, getQueryString } from "../../utils/request";
import { requiredFields } from "../../utils/validation";

// Get All Hotels
export const getAllHotels = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const starRating = getQueryString(req, "star_rating");
    const result = await hotelService.getAllHotels({
      city: getQueryString(req, "city"),
      star_rating: starRating ? Number(starRating) : undefined,
    });

    successResponse(res, 200, "Hotels fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 500, err.message);
  }
};

// Get Hotel By ID
export const getHotelById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await hotelService.getHotelById(getParam(req, "id"));
    successResponse(res, 200, "Hotel fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 404, err.message);
  }
};

// Create Hotel
export const createHotel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, city, address, star_rating, amenities } =
      req.body;

    const errors = requiredFields(req.body, {
      name: "Hotel name is required",
      city: "City is required",
      address: "Address is required",
    });

    if (star_rating && (star_rating < 1 || star_rating > 5)) {
      errors.push({
        field: "star_rating",
        message: "Star rating must be between 1 and 5",
      });
    }

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await hotelService.createHotel({
      seller_id: getAuthUser(req).id,
      name,
      description,
      city,
      address,
      star_rating,
      amenities,
    });

    successResponse(
      res,
      201,
      "Hotel created successfully and is pending approval",
      result,
    );
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

// Update Hotel
export const updateHotel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await hotelService.updateHotel(
      getParam(req, "id"),
      getAuthUser(req).id,
      req.body,
    );

    successResponse(res, 200, "Hotel updated successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

// Delete Hotel
export const deleteHotel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await hotelService.deleteHotel(getParam(req, "id"), getAuthUser(req).id);
    successResponse(res, 200, "Hotel deleted successfully");
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

// Approve Hotel (Admin)
export const approveHotel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await hotelService.updateHotelStatus(
      getParam(req, "id"),
      "approved",
    );

    successResponse(res, 200, "Hotel approved successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

// Reject Hotel (Admin)
export const rejectHotel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await hotelService.updateHotelStatus(
      getParam(req, "id"),
      "rejected",
    );

    successResponse(res, 200, "Hotel rejected successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};
