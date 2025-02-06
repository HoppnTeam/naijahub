export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  parent_id: string | null;
  subcategories?: Category[];
}