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
  _count?: {
    comments: number;
    likes: number;
  };
}