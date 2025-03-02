import { Database } from '@/integrations/supabase/types';

export type MarketplaceType = 'tech' | 'auto' | 'beauty';

export interface MarketplaceChat {
  id: string;
  created_at: string;
  marketplace_messages?: MarketplaceMessage[];
}

export interface MarketplaceMessage {
  id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface MarketplaceLike {
  count: number;
}

export interface BaseMarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  seller_id: string;
  status: string | null;
  created_at: string;
  updated_at: string;
  location: string;
  condition: string;
  category: string;
  marketplace_chats?: MarketplaceChat[];
}

export interface TechMarketplaceListing extends BaseMarketplaceListing {
  tech_marketplace_likes?: MarketplaceLike[];
  brand?: string;
  model?: string;
  specifications?: Record<string, string>;
}

export interface AutoMarketplaceListing extends BaseMarketplaceListing {
  auto_marketplace_likes?: MarketplaceLike[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuel_type?: string;
}

export interface BeautyMarketplaceListing extends BaseMarketplaceListing {
  beauty_marketplace_likes?: MarketplaceLike[];
  brand?: string;
  ingredients?: string[];
}

export type MarketplaceListing = 
  | TechMarketplaceListing 
  | AutoMarketplaceListing 
  | BeautyMarketplaceListing;

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
