import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Post } from "@/types/post";

interface BusinessPostsProps {
  selectedSubcategory: string;
  setSelectedSubcategory: (value: string) => void;
  subcategories?: { id: string; name: string }[];
}

export const BusinessPosts = ({ 
  selectedSubcategory, 
  setSelectedSubcategory,
  subcategories 
}: BusinessPostsProps) => {
  const { data: posts } = useQuery({
    queryKey: ["business-posts", selectedSubcategory],
    queryFn: async () => {
      const query = supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles!posts_user_id_fkey (username, avatar_url),
          categories:categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("categories.name", "Business")
        .order("created_at", { ascending: false });

      if (selectedSubcategory !== "all") {
        query.eq("subcategory_id", selectedSubcategory);
      }

      const { data } = await query;
      
      return data?.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];
    },
  });

  return (
    <Tabs defaultValue="all" value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
      <TabsList className="w-full mb-6">
        <TabsTrigger value="all">All Posts</TabsTrigger>
        {subcategories?.map((subcategory) => (
          <TabsTrigger key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={selectedSubcategory}>
        <div className="grid grid-cols-1 gap-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};