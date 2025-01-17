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
      posts: {
        Row: {
          category_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_live: boolean | null
          pinned: boolean | null
          subcategory_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_live?: boolean | null
          pinned?: boolean | null
          subcategory_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_live?: boolean | null
          pinned?: boolean | null
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
          id: string
          interests: string[] | null
          location: string | null
          phone_number: string | null
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
          id?: string
          interests?: string[] | null
          location?: string | null
          phone_number?: string | null
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
          id?: string
          interests?: string[] | null
          location?: string | null
          phone_number?: string | null
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
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      auto_marketplace_section: "vehicles" | "parts"
      delivery_method: "shipping" | "pickup" | "both"
      listing_status: "active" | "sold" | "pending" | "cancelled"
      payment_method: "online" | "cash_on_delivery" | "in_person"
      user_role: "user" | "moderator" | "admin"
      vehicle_type:
        | "car"
        | "motorcycle"
        | "tricycle"
        | "truck"
        | "bus"
        | "van"
        | "parts"
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
