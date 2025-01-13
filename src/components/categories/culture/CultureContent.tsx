import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";

interface CultureContentProps {
  categories: {
    mainCategory: { id: string; name: string };
    subcategories: Array<{ id: string; name: string }>;
  } | undefined;
}

export const CultureContent = ({ categories }: CultureContentProps) => {
  const { data: posts } = useQuery({
    queryKey: ["culture-posts", categories?.mainCategory?.id],
    queryFn: async () => {
      if (!categories?.mainCategory?.id) return [];
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles(username, avatar_url),
          categories:categories(name),
          _count {
            likes: likes_count,
            comments: comments_count
          }
        `)
        .eq("category_id", categories.mainCategory.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!categories?.mainCategory?.id,
  });

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full overflow-x-auto flex space-x-2 mb-6">
        <TabsTrigger value="all">All Posts</TabsTrigger>
        {categories?.subcategories?.map((category) => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>

      {categories?.subcategories?.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts
              ?.filter((post) => post.subcategory_id === category.id)
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};