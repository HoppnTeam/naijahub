export interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  contact_email?: string;
  phone_number?: string;
  interests?: string[];
  community_intent?: string;
  location?: string;
  status?: string;
}