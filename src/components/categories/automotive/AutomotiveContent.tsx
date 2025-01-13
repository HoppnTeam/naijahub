import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/post";

interface AutomotiveContentProps {
  searchQuery: string;
}

export const AutomotiveContent = ({ searchQuery }: AutomotiveContentProps) => {
  const { data: posts } = useQuery({
    queryKey: ["automotive-posts", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories (name),
          likes (count),
          comments (count)
        `)
        .eq("categories.name", "Automotive");

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to match the Post type
      const transformedPosts = data?.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
        }
      })) as Post[];

      return transformedPosts || [];
    },
  });

  return (
    <Tabs defaultValue="latest" className="space-y-6">
      <TabsList>
        <TabsTrigger value="latest">Latest Posts</TabsTrigger>
        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        <TabsTrigger value="workshops">Workshops</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="latest" className="space-y-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </TabsContent>

      <TabsContent value="marketplace" className="space-y-6">
        {posts?.filter(post => post.title.toLowerCase().includes('sale'))
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </TabsContent>

      <TabsContent value="workshops" className="space-y-6">
        {posts?.filter(post => post.title.toLowerCase().includes('workshop'))
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6">
        {posts?.filter(post => post.title.toLowerCase().includes('review'))
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </TabsContent>
    </Tabs>
  );
};