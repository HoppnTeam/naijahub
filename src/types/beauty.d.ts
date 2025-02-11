
export type BeautyProfessionalSpecialty = 
  | 'hair_stylist'
  | 'makeup_artist'
  | 'nail_technician'
  | 'esthetician'
  | 'barber'
  | 'lash_technician' 
  | 'spa_therapist'
  | 'cosmetologist';

export interface BeautyProfessional {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  specialties: BeautyProfessionalSpecialty[];
  years_experience: number | null;
  portfolio_images: string[];
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  instagram_handle: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  verified: boolean;
  professional_type: BeautyProfessionalSpecialty;
  profiles?: {
    username: string;
    avatar_url: string | null;
  } | null;
}

export type ServiceLocationType = 'in_store' | 'home_service' | 'both';

export type ServiceCategory =
  | 'hair_styling'
  | 'makeup'
  | 'nail_care'
  | 'skincare'
  | 'massage'
  | 'facial'
  | 'waxing'
  | 'lash_extensions'
  | 'microblading'
  | 'other';

export interface BeautyProfessionalService {
  id: string;
  professional_id: string;
  service_name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  service_location: ServiceLocationType;
  category: ServiceCategory;
  created_at: string;
  updated_at: string;
}

export interface Designer {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  specialties: string[];
  years_experience: number | null;
  portfolio_images: string[];
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  instagram_handle: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
  profiles?: {
    username: string;
    avatar_url: string | null;
  } | null;
}
