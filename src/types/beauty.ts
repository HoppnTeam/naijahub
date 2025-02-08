
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
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

export type BeautyProfessionalSpecialty = 
  | 'hair_stylist'
  | 'makeup_artist'
  | 'nail_technician'
  | 'esthetician'
  | 'barber'
  | 'lash_technician'
  | 'spa_therapist'
  | 'cosmetologist';

export interface BeautyProfessionalService {
  id: string;
  professional_id: string;
  service_name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}
