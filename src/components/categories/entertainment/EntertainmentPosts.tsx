import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { PostCard } from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EntertainmentPostsProps {
  categoryId?: string;
  subcategories?: { id: string; name: string }[];
  selectedTab: string;
  onTabChange: (value: string) => void;
}

export const EntertainmentPosts = ({
  categoryId,
  subcategories,
  selectedTab,
  onTabChange,
}: EntertainmentPostsProps) => {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts", "entertainment", selectedTab, categoryId],
    queryFn: async () => {
      if (!categoryId) return [];

      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("category_id", categoryId);

      if (selectedTab === "trending") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(post => ({
        ...post,
        _count: {
          likes: Array.isArray(post.likes) ? post.likes[0]?.count || 0 : 0,
          comments: Array.isArray(post.comments) ? post.comments[0]?.count || 0 : 0
        }
      })) as Post[];
    },
    enabled: !!categoryId,
  });

  return (
    <Tabs value={selectedTab} onValueChange={onTabChange}>
      <TabsList className="w-full justify-start mb-6 overflow-x-auto flex space-x-2">
        <TabsTrigger value="latest">Latest</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
        {subcategories?.map((subcategory) => (
          <TabsTrigger
            key={subcategory.id}
            value={subcategory.id}
            className="whitespace-nowrap"
          >
            {subcategory.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={selectedTab} className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No posts found in this category
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};