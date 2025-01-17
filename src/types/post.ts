export interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  user_id: string;
  category_id: string | null;
  subcategory_id?: string | null;
  pinned?: boolean | null;
  is_live?: boolean | null;
  is_draft?: boolean | null;
  source_url?: string | null;
  price?: number | null;
  condition?: string | null;
  profiles?: {
    username: string;
    avatar_url?: string | null;
  };
  categories?: {
    name: string;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}