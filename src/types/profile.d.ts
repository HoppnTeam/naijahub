import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  contact_email: string | null;
  phone_number: string | null;
  interests: string[] | null;
  community_intent: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  user_roles?: { role: UserRole }[];
};