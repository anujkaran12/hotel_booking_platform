import { Notification } from "../../models/notification.model";
import { CreateNotificationInput } from "./notification.types";

// Create Notification — called internally from other services
export const createNotification = async (input: CreateNotificationInput) => {
  const notification = await Notification.create(input);
  return notification;
};

// Get My Notifications
export const getMyNotifications = async (userId: string) => {
  const notifications = await Notification.find({ user_id: userId }).sort({
    createdAt: -1,
  });
  return notifications;
};

// Mark As Read
export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    user_id: userId,
  });

  if (!notification) throw new Error("Notification not found");

  notification.is_read = true;
  await notification.save();
  return notification;
};

// Mark All As Read
export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany(
    { user_id: userId, is_read: false },
    { is_read: true },
  );
};

// Delete Notification
export const deleteNotification = async (
  notificationId: string,
  userId: string,
) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    user_id: userId,
  });

  if (!notification) throw new Error("Notification not found");

  await Notification.findByIdAndDelete(notificationId);
};
