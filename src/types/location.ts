export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  created_at: string;
  user_id?: string;
}

export interface LocationSearchParams {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  city?: string;
  state?: string;
  country?: string;
}
