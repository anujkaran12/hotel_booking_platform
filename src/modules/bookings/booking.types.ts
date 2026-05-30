export interface CreateBookingInput {
  customer_id: string;
  hotel_id: string;
  room_id: string;
  check_in: Date;
  check_out: Date;
  guests: number;
}

export type BookingStatusUpdate = "confirmed" | "completed";
