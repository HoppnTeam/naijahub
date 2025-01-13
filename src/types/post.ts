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
  profiles?: {
    username: string;
    avatar_url?: string | null;
  } | null;
  categories?: {
    name: string;
  } | null;
  _count: {
    likes: number;
    comments: number;
  };
}