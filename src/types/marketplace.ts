import { Database } from '@/integrations/supabase/types';
import { BeautyProduct } from './beauty-product';

export enum MarketplaceType {
  TECH = 'tech',
  AUTO = 'auto',
  BEAUTY = 'beauty'
}

export interface BaseMarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: string;
  seller_id: string;
  location_id: string;
  status: 'available' | 'sold' | 'reserved';
  created_at: string;
  seller?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  };
}

export interface TechMarketplaceListing extends BaseMarketplaceListing {
  category: string;
  brand: string;
  model: string;
  specifications: Record<string, string>;
}

export interface AutoMarketplaceListing extends BaseMarketplaceListing {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  features: string[];
}

export interface BeautyMarketplaceListing extends BaseMarketplaceListing {
  category: string;
  brand: string;
  quantity: number;
}

export type MarketplaceListing = 
  | TechMarketplaceListing 
  | AutoMarketplaceListing 
  | BeautyMarketplaceListing;

export interface MarketplaceChat {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  listing?: MarketplaceListing;
  buyer?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  seller?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  last_message?: MarketplaceMessage;
}

export interface MarketplaceMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

export interface CartItem {
  id: string;
  user_id: string;
  listing_id: string;
  quantity: number;
  created_at: string;
  beauty_marketplace_listings: {
    title: string;
    price: number;
    images: string[];
  };
}

export interface PaymentMethod {
  type: 'card' | 'bank' | 'delivery';
  details?: Record<string, any>;
}

export interface OrderContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  shipping_address: string;
  payment_method: string;
  contact_info: OrderContactInfo;
  payment_details?: Record<string, any> | null;
  delivery_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  listing_id: string;
  quantity: number;
  price: number;
  created_at: string;
}
