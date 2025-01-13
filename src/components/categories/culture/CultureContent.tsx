import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/post";

interface Category {
  id: string;
  name: string;
}

interface CultureContentProps {
  categories: {
    mainCategory: Category;
    subcategories: Category[];
  } | undefined;
}

export const CultureContent = ({ categories }: CultureContentProps) => {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["culture-posts", categories?.mainCategory?.id],
    queryFn: async () => {
      if (!categories?.mainCategory?.id) return [];
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories (name),
          likes (count),
          comments (count)
        `)
        .eq("category_id", categories.mainCategory.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map(post => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
        }
      })) as Post[];
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