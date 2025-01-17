import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";

interface NewsPost extends Post {
  categories: {
    name: string;
  } | null;
}

export const useDraftNewsPosts = () => {
  return useQuery({
    queryKey: ["draft-news-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          categories:category_id!posts_category_id_fkey (name)
        `)
        .eq("is_draft", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching draft posts:", error);
        throw error;
      }

      return (data || []).map(post => ({
        ...post,
        categories: post.categories || null
      })) as NewsPost[];
    },
  });
};