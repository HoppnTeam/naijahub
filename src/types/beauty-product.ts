import { Location } from './location';

export type BeautyCategory = 
  | 'Skincare'
  | 'Haircare'
  | 'Makeup'
  | 'Fragrance'
  | 'Bath & Body'
  | 'Tools & Accessories';

export interface BeautyProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: BeautyCategory;
  brand: string;
  ingredients?: string[];
  quantity: number;
  images: string[];
  seller_id: string;
  location_id: string;
  status: 'available' | 'sold' | 'unavailable';
  created_at: string;
  condition: string;
  seller?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  location?: {
    id: string;
    city: string;
    state: string;
  };
}
