import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // First get the profile with posts
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          posts (
            id,
            title,
            content,
            created_at,
            category_id,
            image_url,
            comments:comments(count),
            likes:likes(count)
          ),
          user_roles (
            role
          )
        `)
        .eq("user_id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      // Transform the data to include the counts in the expected format
      const transformedProfile = profileData ? {
        ...profileData,
        posts: profileData.posts?.map(post => ({
          ...post,
          _count: {
            comments: post.comments?.[0]?.count || 0,
            likes: post.likes?.[0]?.count || 0
          }
        }))
      } : null;

      return transformedProfile as Profile | null;
    },
    enabled: !!userId,
  });
};