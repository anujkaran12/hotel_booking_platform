export interface CreateRoomInput {
  hotel_id: string;
  room_type: string;
  price_per_night: number;
  capacity: number;
  total_rooms: number;
  amenities?: string[];
  images?: string[];
}
