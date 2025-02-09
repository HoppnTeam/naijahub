
export type BeautyProfessionalSpecialty = 
  | 'nail_technician'
  | 'esthetician'
  | 'barber'
  | 'lash_technician' 
  | 'spa_therapist'
  | 'cosmetologist';

export interface BeautyProfessionalFormValues {
  business_name: string;
  description: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  instagram_handle?: string;
  specialties: BeautyProfessionalSpecialty[];
  years_experience: number;
  professional_type: BeautyProfessionalSpecialty;
}

export interface BeautyProfessional {
  id: string;
  business_name: string;
  description: string;
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  website?: string | null;
  instagram_handle?: string | null;
  portfolio_images: string[];
  specialties: BeautyProfessionalSpecialty[];
  years_experience: number | null;
  rating: number;
  review_count: number;
  verified: boolean;
  latitude?: number | null;
  longitude?: number | null;
  user_id: string;
  professional_type: BeautyProfessionalSpecialty;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface Designer {
  id: string;
  business_name: string;
  description: string;
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  website?: string | null;
  instagram_handle?: string | null;
  portfolio_images: string[];
  specialties: string[];
  years_experience: number | null;
  rating: number;
  review_count: number;
  verified: boolean;
  latitude?: number | null;
  longitude?: number | null;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}
