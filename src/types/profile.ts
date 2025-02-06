export interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at: string;
  contact_email?: string | null;
  phone_number?: string | null;
  interests?: string[] | null;
  community_intent?: string | null;
  location?: string | null;
  status?: string;
  points?: number;
  level?: number;
  user_roles?: { role: string }[];
  posts?: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    category_id?: string;
    subcategory_id?: string;
    image_url?: string;
    pinned?: boolean;
    is_live?: boolean;
    is_draft?: boolean;
    _count?: {
      comments: number;
      likes: number;
    };
  }[];
}