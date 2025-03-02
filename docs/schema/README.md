# NaijaHub Database Schema Documentation

This document provides a comprehensive overview of the NaijaHub database schema, including tables, relationships, functions, and security policies.

## Table of Contents

1. [Database Overview](#database-overview)
2. [Core Tables](#core-tables)
3. [Marketplace Tables](#marketplace-tables)
4. [Monitoring Tables](#monitoring-tables)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [Database Functions](#database-functions)
7. [Row Level Security Policies](#row-level-security-policies)
8. [Indexes and Performance](#indexes-and-performance)
9. [Schema Migrations](#schema-migrations)

## Database Overview

NaijaHub uses PostgreSQL via Supabase as its primary database. The schema is designed to support:

- User authentication and profiles
- Content management (posts, comments, categories)
- Marketplace functionality (listings, orders, reviews)
- Monitoring and analytics
- Location-based features

## Core Tables

### Users

The `users` table extends Supabase's built-in `auth.users` table with additional profile information.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Posts

The `posts` table stores all user-generated content.

```sql
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0
);
```

### Comments

The `comments` table stores user comments on posts.

```sql
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  post_id UUID REFERENCES public.posts(id) NOT NULL,
  parent_id UUID REFERENCES public.comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);
```

### Categories

The `categories` table organizes content into different sections.

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Marketplace Tables

### Listings

The `marketplace_listings` table stores product listings across different marketplace categories.

```sql
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  marketplace_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  location_id UUID REFERENCES public.locations(id),
  images JSONB DEFAULT '[]'::jsonb,
  attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Orders

The `orders` table tracks marketplace transactions.

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  listing_id UUID REFERENCES public.marketplace_listings(id) NOT NULL,
  status TEXT DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  payment_method TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

## Beauty Marketplace

### beauty_products

Beauty products available for sale in the marketplace.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Product title |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Product price |
| category | TEXT | Product category (skincare, haircare, nails, makeup, fragrance, tools, other) |
| condition | TEXT | Product condition (new, like-new, good, fair) |
| brand | TEXT | Product brand (optional) |
| images | TEXT[] | Array of image URLs |
| created_at | TIMESTAMP WITH TIME ZONE | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | Last update timestamp |
| seller_id | UUID | Reference to auth.users(id) |
| location_id | UUID | Reference to locations(id) |
| status | TEXT | Product status (available, sold, pending) |
| features | TEXT[] | Array of product features (optional) |
| expiry_date | DATE | Product expiry date (optional) |
| ingredients | TEXT[] | Array of product ingredients (optional) |
| quantity | INTEGER | Available quantity |
| views | INTEGER | View count |
| saved_count | INTEGER | Number of times saved |

### saved_beauty_products

Wishlist functionality for beauty products.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users(id) |
| product_id | UUID | Reference to beauty_products(id) |
| created_at | TIMESTAMP WITH TIME ZONE | Creation timestamp |

### beauty_marketplace_orders

Orders for beauty products.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users(id) |
| total_amount | DECIMAL(10,2) | Total order amount |
| status | TEXT | Order status (pending, processing, shipped, completed, cancelled) |
| shipping_address | TEXT | Delivery address |
| payment_method | TEXT | Payment method (card, bank, delivery) |
| contact_info | JSONB | Contact information (name, email, phone) |
| payment_details | JSONB | Payment details (optional) |
| delivery_notes | TEXT | Special delivery instructions (optional) |
| created_at | TIMESTAMP WITH TIME ZONE | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | Last update timestamp |

### beauty_marketplace_order_items

Individual items within a beauty marketplace order.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | Reference to beauty_marketplace_orders(id) |
| listing_id | UUID | Reference to beauty_products(id) |
| quantity | INTEGER | Quantity ordered |
| price | DECIMAL(10,2) | Price at time of purchase |
| created_at | TIMESTAMP WITH TIME ZONE | Creation timestamp |

### beauty_marketplace_cart_items

Shopping cart items for beauty marketplace.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users(id) |
| listing_id | UUID | Reference to beauty_products(id) |
| quantity | INTEGER | Quantity in cart |
| created_at | TIMESTAMP WITH TIME ZONE | Creation timestamp |

## Monitoring Tables

### Error Logs

The `error_logs` table stores application errors for monitoring and debugging.

```sql
CREATE TABLE public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  source TEXT NOT NULL,
  severity TEXT NOT NULL,
  stack TEXT,
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Performance Metrics

The `performance_metrics` table stores application performance data.

```sql
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  name TEXT NOT NULL,
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Events

The `events` table tracks user interactions and system events.

```sql
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Authentication and Authorization

NaijaHub uses Supabase Auth for authentication, which provides:

- Email/password authentication
- OAuth providers (Google, Facebook, etc.)
- Magic link authentication
- Phone authentication

## Database Functions

### Location Functions

```sql
-- Get nearby locations within a radius
CREATE OR REPLACE FUNCTION get_nearby_locations(lat float, lng float, radius_km float)
RETURNS SETOF locations AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM locations
  WHERE calculate_distance(lat, lng, locations.latitude, locations.longitude) <= radius_km
  ORDER BY calculate_distance(lat, lng, locations.latitude, locations.longitude);
END;
$$ LANGUAGE plpgsql;
```

### Monitoring Functions

```sql
-- Get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'table_sizes', (
      SELECT jsonb_object_agg(table_name, pg_total_relation_size(table_name::text))
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ),
    'row_counts', (
      SELECT jsonb_object_agg(table_name, (SELECT count(*) FROM public.table_name))
      FROM information_schema.tables
      WHERE table_schema = 'public'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Row Level Security Policies

NaijaHub uses Row Level Security (RLS) to ensure data privacy and security:

```sql
-- Example RLS policy for posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can read all published posts
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (is_published = true);

-- Users can only update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

## Indexes and Performance

NaijaHub uses strategic indexes to optimize query performance:

```sql
-- Example indexes
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_category_id_idx ON posts(category_id);
CREATE INDEX comments_post_id_idx ON comments(post_id);
CREATE INDEX marketplace_listings_user_id_idx ON marketplace_listings(user_id);
CREATE INDEX marketplace_listings_marketplace_type_idx ON marketplace_listings(marketplace_type);
```

## Schema Migrations

NaijaHub uses Supabase migrations to manage database schema changes. Migration files are stored in the `supabase/migrations` directory and are applied in numerical order.

Current migrations:
- `20250301_000_locations.sql`: Creates locations table and functions
- `20250301_001_events.sql`: Creates events tracking table
- `20250301_001_location_functions.sql`: Adds location-related functions
- `20250301_002_beauty_marketplace.sql`: Adds beauty marketplace tables
- `20250301_003_beauty_functions.sql`: Adds beauty marketplace functions
- `20250301_004_monitoring_functions.sql`: Adds monitoring and error tracking
