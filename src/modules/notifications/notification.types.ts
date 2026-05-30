export type NotificationType =
  | "booking"
  | "payment"
  | "cancellation"
  | "general";

export interface CreateNotificationInput {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
}
