import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { TabsContent } from "@/components/ui/tabs";
import { Post } from "@/types/post";

export const HealthContent = () => {
  const { data: healthCategory } = useQuery({
    queryKey: ["health-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Health")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["health-posts", healthCategory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_fkey (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("category_id", healthCategory?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data?.map(post => ({
        ...post,
        profiles: post.profiles || { username: '', avatar_url: null },
        categories: post.categories || { name: '' },
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) || []) as Post[];
    },
    enabled: !!healthCategory?.id,
  });

  const tabs = ["all", "fitness", "nutrition", "mental-health", "natural-remedies", "disease-alert"];

  return (
    <>
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab} className="space-y-6">
          {posts
            ?.filter((post) =>
              tab === "all" ? true : post.title.toLowerCase().includes(tab) || post.subcategory_id === tab
            )
            .map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </TabsContent>
      ))}
    </>
  );
};