export interface Workshop {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  workshop_type: "mechanic" | "auto_electrician" | "panel_beater" | "tire_service" | "car_wash" | "diagnostics_center" | "spare_parts" | "general_service";
  address: string;
  city: string;
  state: string;
  latitude?: number | null;
  longitude?: number | null;
  phone_number?: string | null;
  email?: string | null;
  website?: string | null;
  opening_hours?: Record<string, string> | null;
  services_offered?: string[] | null;
  verified: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}