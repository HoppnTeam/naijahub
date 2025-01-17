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
  user_roles?: { role: string }[];
  posts?: any[];
}