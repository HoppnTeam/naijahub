export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  category_id?: string;
  subcategory_id?: string | null;
  image_url?: string;
  pinned?: boolean;
  is_live?: boolean;
  is_draft?: boolean;
  source_url?: string | null;
  scheduled_publish_date?: string | null;
  seeking_gender?: string | null;
  age_range?: string | null;
  relationship_type?: string | null;
  location_preference?: string | null;
  interests?: string[] | null;
  _count?: {
    comments: number;
    likes: number;
  };
  profiles?: {
    username: string;
    avatar_url?: string | null;
  };
  categories?: {
    name: string;
  };
}