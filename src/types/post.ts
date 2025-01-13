export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes?: any[];
  comments?: any[];
  categories?: {
    name: string;
  };
}