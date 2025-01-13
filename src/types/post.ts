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
  likes?: { user_id: string }[];
  comments?: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
      username: string;
      avatar_url?: string | null;
    } | null;
  }[];
  _count?: {
    comments: number;
    likes: number;
  };
}