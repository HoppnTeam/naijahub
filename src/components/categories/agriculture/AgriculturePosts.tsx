import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { PostCard } from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AgriculturePosts = () => {
  const subcategories = [
    "All",
    "Organic Farming",
    "Farm Inputs",
    "How to Start a FARM",
  ];

  const { data: posts, isLoading } = useQuery({
    queryKey: ["agriculture-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          image_url,
          created_at,
          updated_at,
          user_id,
          category_id,
          subcategory_id,
          pinned,
          is_live,
          profiles (
            username,
            avatar_url
          ),
          categories (
            name
          ),
          likes:likes(count),
          comments:comments(count)
        `)
        .eq("categories.name", "Agriculture")
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
  });

  return (
    <Tabs defaultValue="All" className="mb-8">
      <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
        {subcategories.map((sub) => (
          <TabsTrigger key={sub} value={sub} className="flex-shrink-0">
            {sub}
          </TabsTrigger>
        ))}
      </TabsList>

      {subcategories.map((sub) => (
        <TabsContent key={sub} value={sub}>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid gap-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};