export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          threshold: number
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          threshold: number
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          threshold?: number
          type?: Database["public"]["Enums"]["achievement_type"]
        }
        Relationships: []
      }
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_admin_profiles"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_admin_profiles"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      advertisements: {
        Row: {
          advertiser_id: string | null
          click_count: number | null
          created_at: string
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          impression_count: number | null
          placement: string
          start_date: string
          status: string
          tier: string
          title: string
          updated_at: string
        }
        Insert: {
          advertiser_id?: string | null
          click_count?: number | null
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          impression_count?: number | null
          placement: string
          start_date: string
          status?: string
          tier: string
          title: string
          updated_at?: string
        }
        Update: {
          advertiser_id?: string | null
          click_count?: number | null
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          impression_count?: number | null
          placement?: string
          start_date?: string
          status?: string
          tier?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      auto_marketplace_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          listing_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          listing_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          listing_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_marketplace_comments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "auto_marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_marketplace_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      auto_marketplace_likes: {
        Row: {
          created_at: string
          id: string
          listing_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_marketplace_likes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "auto_marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_marketplace_listings: {
        Row: {
          business_verified: boolean | null
          condition: string
          created_at: string
          description: string
          features: string[] | null
          fuel_type: string | null
          google_place_id: string | null
          id: string
          images: string[]
          is_business: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          make: string | null
          mileage: number | null
          model: string | null
          part_category_id: string | null
          price: number
          section: Database["public"]["Enums"]["auto_marketplace_section"]
          seller_id: string
          status: string | null
          title: string
          transmission: string | null
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number | null
        }
        Insert: {
          business_verified?: boolean | null
          condition: string
          created_at?: string
          description: string
          features?: string[] | null
          fuel_type?: string | null
          google_place_id?: string | null
          id?: string
          images?: string[]
          is_business?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          part_category_id?: string | null
          price: number
          section?: Database["public"]["Enums"]["auto_marketplace_section"]
          seller_id: string
          status?: string | null
          title: string
          transmission?: string | null
          updated_at?: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year?: number | null
        }
        Update: {
          business_verified?: boolean | null
          condition?: string
          created_at?: string
          description?: string
          features?: string[] | null
          fuel_type?: string | null
          google_place_id?: string | null
          id?: string
          images?: string[]
          is_business?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          part_category_id?: string | null
          price?: number
          section?: Database["public"]["Enums"]["auto_marketplace_section"]
          seller_id?: string
          status?: string | null
          title?: string
          transmission?: string | null
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_marketplace_listings_part_category_id_fkey"
            columns: ["part_category_id"]
            isOneToOne: false
            referencedRelation: "auto_parts_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_marketplace_listings_seller_id_profiles_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_listings_seller_id_profiles_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      auto_marketplace_orders: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          delivery_method: string
          delivery_status: string
          id: string
          listing_id: string
          payment_method: string
          payment_status: string
          paystack_reference: string | null
          seller_id: string
          shipping_address: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          delivery_method: string
          delivery_status?: string
          id?: string
          listing_id: string
          payment_method: string
          payment_status?: string
          paystack_reference?: string | null
          seller_id: string
          shipping_address?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          delivery_method?: string
          delivery_status?: string
          id?: string
          listing_id?: string
          payment_method?: string
          payment_status?: string
          paystack_reference?: string | null
          seller_id?: string
          shipping_address?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_marketplace_orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "auto_marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_marketplace_orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      auto_marketplace_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          listing_id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_marketplace_reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "auto_marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_marketplace_reviews_reviewed_id_fkey"
            columns: ["reviewed_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_reviews_reviewed_id_fkey"
            columns: ["reviewed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "auto_marketplace_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      auto_parts_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      automotive_workshops: {
        Row: {
          address: string
          business_status: string | null
          city: string
          created_at: string
          description: string | null
          email: string | null
          formatted_address: string | null
          google_place_id: string | null
          google_rating: number | null
          google_reviews_count: number | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone_number: string | null
          photos_urls: string[] | null
          place_types: string[] | null
          rating: number | null
          review_count: number | null
          services_offered: string[] | null
          state: string
          updated_at: string
          user_id: string
          verified: boolean | null
          website: string | null
          workshop_type: Database["public"]["Enums"]["workshop_type"]
        }
        Insert: {
          address: string
          business_status?: string | null
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          formatted_address?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone_number?: string | null
          photos_urls?: string[] | null
          place_types?: string[] | null
          rating?: number | null
          review_count?: number | null
          services_offered?: string[] | null
          state: string
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website?: string | null
          workshop_type: Database["public"]["Enums"]["workshop_type"]
        }
        Update: {
          address?: string
          business_status?: string | null
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          formatted_address?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone_number?: string | null
          photos_urls?: string[] | null
          place_types?: string[] | null
          rating?: number | null
          review_count?: number | null
          services_offered?: string[] | null
          state?: string
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          website?: string | null
          workshop_type?: Database["public"]["Enums"]["workshop_type"]
        }
        Relationships: []
      }
      car_reviews: {
        Row: {
          cons: string[] | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          make: string
          model: string
          pros: string[] | null
          rating: number | null
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          year: number
        }
        Insert: {
          cons?: string[] | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          make: string
          model: string
          pros?: string[] | null
          rating?: number | null
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          year: number
        }
        Update: {
          cons?: string[] | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          make?: string
          model?: string
          pros?: string[] | null
          rating?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "car_reviews_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "car_reviews_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      celebrity_follows: {
        Row: {
          celebrity_name: string
          created_at: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          celebrity_name: string
          created_at?: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          celebrity_name?: string
          created_at?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      celebrity_posts: {
        Row: {
          celebrity_name: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          post_type: string | null
          user_id: string
        }
        Insert: {
          celebrity_name: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          post_type?: string | null
          user_id: string
        }
        Update: {
          celebrity_name?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          post_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "celebrity_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "celebrity_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      external_tech_jobs: {
        Row: {
          application_url: string
          company_name: string
          created_at: string
          description: string
          external_id: string
          id: string
          job_type: string
          location: string
          location_type: string
          requirements: string | null
          salary_range: string | null
          skills: string[] | null
          source: string
          title: string
          updated_at: string
        }
        Insert: {
          application_url: string
          company_name: string
          created_at?: string
          description: string
          external_id: string
          id?: string
          job_type: string
          location: string
          location_type: string
          requirements?: string | null
          salary_range?: string | null
          skills?: string[] | null
          source: string
          title: string
          updated_at?: string
        }
        Update: {
          application_url?: string
          company_name?: string
          created_at?: string
          description?: string
          external_id?: string
          id?: string
          job_type?: string
          location?: string
          location_type?: string
          requirements?: string | null
          salary_range?: string | null
          skills?: string[] | null
          source?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      issue_reports: {
        Row: {
          category: Database["public"]["Enums"]["report_category"]
          created_at: string
          description: string
          id: string
          image_url: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["report_category"]
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["report_category"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reports_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "issue_reports_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_chats: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_chats_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "tech_marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_chats_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "marketplace_chats_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "marketplace_chats_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "marketplace_chats_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      marketplace_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "marketplace_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "marketplace_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      marketplace_moderation_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          listing_id: string
          listing_type: Database["public"]["Enums"]["marketplace_listing_type"]
          reason: string | null
          updated_at: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          listing_id: string
          listing_type: Database["public"]["Enums"]["marketplace_listing_type"]
          reason?: string | null
          updated_at?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          listing_type?: Database["public"]["Enums"]["marketplace_listing_type"]
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      moderation_reports: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reason: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reason: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reason?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_violations: {
        Row: {
          action_taken: string | null
          created_at: string | null
          description: string | null
          detected_at: string | null
          id: string
          post_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          violation_type: Database["public"]["Enums"]["violation_type"]
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          post_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          violation_type: Database["public"]["Enums"]["violation_type"]
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          post_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          violation_type?: Database["public"]["Enums"]["violation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "post_violations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          age_range: string | null
          category_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          interests: string[] | null
          is_draft: boolean | null
          is_live: boolean | null
          location_preference: string | null
          pinned: boolean | null
          relationship_type: string | null
          scheduled_publish_date: string | null
          seeking_gender: string | null
          source_url: string | null
          subcategory_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          interests?: string[] | null
          is_draft?: boolean | null
          is_live?: boolean | null
          location_preference?: string | null
          pinned?: boolean | null
          relationship_type?: string | null
          scheduled_publish_date?: string | null
          seeking_gender?: string | null
          source_url?: string | null
          subcategory_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          interests?: string[] | null
          is_draft?: boolean | null
          is_live?: boolean | null
          location_preference?: string | null
          pinned?: boolean | null
          relationship_type?: string | null
          scheduled_publish_date?: string | null
          seeking_gender?: string | null
          source_url?: string | null
          subcategory_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "posts_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          community_intent: string | null
          contact_email: string | null
          created_at: string
          followers_count: number | null
          following_count: number | null
          id: string
          interests: string[] | null
          level: number | null
          location: string | null
          phone_number: string | null
          points: number | null
          status: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          community_intent?: string | null
          contact_email?: string | null
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          interests?: string[] | null
          level?: number | null
          location?: string | null
          phone_number?: string | null
          points?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          community_intent?: string | null
          contact_email?: string | null
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          interests?: string[] | null
          level?: number | null
          location?: string | null
          phone_number?: string | null
          points?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      sports_fan_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          team_name: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          team_name: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          team_name?: string
          user_id?: string
        }
        Relationships: []
      }
      sports_team_follows: {
        Row: {
          created_at: string
          id: string
          league: string
          reason: string | null
          team_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          league: string
          reason?: string | null
          team_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          league?: string
          reason?: string | null
          team_name?: string
          user_id?: string
        }
        Relationships: []
      }
      tech_jobs: {
        Row: {
          application_url: string
          company_name: string
          created_at: string
          description: string
          id: string
          job_type: string
          location: string
          location_type: string
          requirements: string
          salary_range: string | null
          skills: string[]
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_url: string
          company_name: string
          created_at?: string
          description: string
          id?: string
          job_type: string
          location: string
          location_type: string
          requirements: string
          salary_range?: string | null
          skills?: string[]
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_url?: string
          company_name?: string
          created_at?: string
          description?: string
          id?: string
          job_type?: string
          location?: string
          location_type?: string
          requirements?: string
          salary_range?: string | null
          skills?: string[]
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tech_jobs_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tech_jobs_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tech_marketplace_likes: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tech_marketplace_likes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "tech_marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_marketplace_listings: {
        Row: {
          category: string
          condition: string
          created_at: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          description: string
          id: string
          images: string[]
          location: string
          payment_methods: Database["public"]["Enums"]["payment_method"][]
          price: number
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          condition: string
          created_at?: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          description: string
          id?: string
          images: string[]
          location: string
          payment_methods: Database["public"]["Enums"]["payment_method"][]
          price: number
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          description?: string
          id?: string
          images?: string[]
          location?: string
          payment_methods?: Database["public"]["Enums"]["payment_method"][]
          price?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tech_marketplace_listings_seller_id_profiles_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tech_marketplace_listings_seller_id_profiles_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tech_marketplace_orders: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          delivery_status: string
          id: string
          listing_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: string
          paystack_reference: string | null
          seller_id: string
          shipping_address: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          delivery_status?: string
          id?: string
          listing_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: string
          paystack_reference?: string | null
          seller_id: string
          shipping_address?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          delivery_status?: string
          id?: string
          listing_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: string
          paystack_reference?: string | null
          seller_id?: string
          shipping_address?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tech_marketplace_orders_buyer_id_profiles_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tech_marketplace_orders_buyer_id_profiles_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tech_marketplace_orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "tech_marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tech_marketplace_orders_seller_id_profiles_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tech_marketplace_orders_seller_id_profiles_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tech_marketplace_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tech_marketplace_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "tech_marketplace_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      workshop_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          user_id: string | null
          workshop_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
          workshop_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshop_reviews_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "automotive_workshops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          level: number | null
          points: number | null
          rank: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_weekly_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          username: string
          avatar_url: string
          points: number
          level: number
          user_id: string
          rank: number
        }[]
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      achievement_type:
        | "post_milestone"
        | "engagement"
        | "following"
        | "sharing"
      auto_marketplace_section: "vehicles" | "parts"
      delivery_method: "shipping" | "pickup" | "both"
      listing_status: "active" | "sold" | "pending" | "cancelled"
      marketplace_listing_type: "auto" | "tech"
      payment_method: "online" | "cash_on_delivery" | "in_person"
      report_category:
        | "content"
        | "transaction"
        | "app_improvement"
        | "user_related"
        | "general"
      user_role: "user" | "moderator" | "admin"
      vehicle_type:
        | "car"
        | "motorcycle"
        | "tricycle"
        | "truck"
        | "bus"
        | "van"
        | "parts"
      violation_type:
        | "hate_speech"
        | "inappropriate_content"
        | "spam"
        | "misinformation"
        | "harassment"
        | "violence"
        | "other"
      workshop_type:
        | "mechanic"
        | "auto_electrician"
        | "panel_beater"
        | "tire_service"
        | "car_wash"
        | "diagnostics_center"
        | "spare_parts"
        | "general_service"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
