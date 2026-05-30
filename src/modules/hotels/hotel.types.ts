export interface CreateHotelInput {
  seller_id: string;
  name: string;
  description?: string;
  city: string;
  address: string;
  star_rating?: number;
  amenities?: string[];
}

export interface GetAllHotelsInput {
  city?: string;
  star_rating?: number;
}

export type HotelStatusUpdate = "approved" | "rejected";
