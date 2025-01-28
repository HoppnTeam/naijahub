import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner (
            role
          )
        `)
        .eq("user_id", userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Profile query error:", profileError);
        throw profileError;
      }

      return profileData as Profile | null;
    },
    enabled: !!userId,
  });
};