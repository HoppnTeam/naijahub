import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";

interface Category {
  id: string;
  name: string;
}

interface PostResponse {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  category_id: string | null;
  subcategory_id: string | null;
  pinned: boolean | null;
  is_live: boolean | null;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
  categories: {
    name: string;
  } | null;
  likes: { id: string }[];
  comments: { id: string }[];
}

export const useCulturePosts = (mainCategory: Category | undefined) => {
  return useQuery<Post[]>({
    queryKey: ["culture-posts", mainCategory?.id],
    queryFn: async () => {
      if (!mainCategory?.id) return [];
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (id),
          comments (id)
        `)
        .eq("category_id", mainCategory.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const typedData = data as unknown as PostResponse[];
      return typedData.map(post => ({
        ...post,
        profiles: post.profiles || undefined,
        categories: post.categories || undefined,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
        }
      })) as Post[];
    },
    enabled: !!mainCategory?.id,
  });
};