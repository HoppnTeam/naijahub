import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  user_roles: { role: UserRole }[];
};

export type ProfileHookReturn = {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
};