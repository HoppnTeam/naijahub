import { Json } from "@/integrations/supabase/types";

export interface Workshop {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  workshop_type: "mechanic" | "auto_electrician" | "panel_beater" | "tire_service" | "car_wash" | "diagnostics_center" | "spare_parts" | "general_service";
  address: string;
  city: string;
  state: string;
  latitude?: number | null;
  longitude?: number | null;
  phone_number?: string | null;
  email?: string | null;
  website?: string | null;
  opening_hours?: Json | null;
  services_offered?: string[] | null;
  verified: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  google_place_id?: string | null;
  google_rating?: number | null;
  google_reviews_count?: number | null;
  formatted_address?: string | null;
  place_types?: string[] | null;
  business_status?: string | null;
  photos_urls?: string[] | null;
}