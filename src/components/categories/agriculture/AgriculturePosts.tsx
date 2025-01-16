import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { PostCard } from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

export const AgriculturePosts = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: subcategories } = useQuery({
    queryKey: ["agriculture-subcategories"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Agriculture")
        .single();

      if (!parentCategory) throw new Error("Agriculture category not found");

      const { data: subcategories, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("parent_id", parentCategory.id);

      if (error) throw error;
      return subcategories as Category[];
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["agriculture-posts", selectedSubcategory],
    queryFn: async () => {
      let query = supabase
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
          categories!posts_category_id_fkey (
            name
          ),
          likes:likes(count),
          comments:comments(count)
        `);

      // Get the Agriculture category ID first
      const { data: agricultureCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Agriculture")
        .single();

      if (!agricultureCategory) throw new Error("Agriculture category not found");

      query = query.eq("category_id", agricultureCategory.id);

      if (selectedSubcategory) {
        query = query.eq("subcategory_id", selectedSubcategory);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

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
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
        <TabsTrigger value="all" onClick={() => setSelectedSubcategory(null)}>
          All Posts
        </TabsTrigger>
        {subcategories?.map((sub) => (
          <TabsTrigger
            key={sub.id}
            value={sub.id}
            onClick={() => setSelectedSubcategory(sub.id)}
          >
            {sub.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={selectedSubcategory || "all"} className="mt-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};