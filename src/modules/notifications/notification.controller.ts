import { Request, Response } from "express";
import * as notificationService from "./notification.service";
import { errorResponse, successResponse } from "../../utils/apiResponse";
import { getAuthUser, getParam } from "../../utils/request";

// Get My Notifications
export const getMyNotifications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await notificationService.getMyNotifications(
      getAuthUser(req).id,
    );

    successResponse(res, 200, "Notifications fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 500, err.message);
  }
};

// Mark As Read
export const markAsRead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await notificationService.markAsRead(
      getParam(req, "id"),
      getAuthUser(req).id,
    );

    successResponse(res, 200, "Notification marked as read", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

// Mark All As Read
export const markAllAsRead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await notificationService.markAllAsRead(getAuthUser(req).id);
    successResponse(res, 200, "All notifications marked as read");
  } catch (err: any) {
    errorResponse(res, 500, err.message);
  }
};

// Delete Notification
export const deleteNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await notificationService.deleteNotification(
      getParam(req, "id"),
      getAuthUser(req).id,
    );

    successResponse(res, 200, "Notification deleted successfully");
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};
