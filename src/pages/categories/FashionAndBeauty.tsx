
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scissors } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";

const FashionAndBeauty = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["fashion-beauty-posts", selectedTab],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles!inner (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("is_draft", false)
        .order("created_at", { ascending: false });

      if (selectedTab !== "all") {
        query = query.eq("subcategory_id", selectedTab);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(post => ({
        ...post,
        user: {
          id: post.user_id,
          username: post.profiles?.username || "Unknown User",
          avatar_url: post.profiles?.avatar_url
        },
        categories: {
          name: post.categories?.name || ""
        },
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-[#E2725B]" />
          <h1 className="text-2xl font-bold">Fashion & Beauty</h1>
        </div>
        <Button onClick={() => navigate("/categories/fashion-beauty/create")}>
          Create Post
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="fashion-trends">Fashion Trends</TabsTrigger>
          <TabsTrigger value="beauty-skincare">Beauty & Skincare</TabsTrigger>
          <TabsTrigger value="hair-styling">Hair & Styling</TabsTrigger>
          <TabsTrigger value="makeup">Makeup</TabsTrigger>
          <TabsTrigger value="traditional">Traditional</TabsTrigger>
          <TabsTrigger value="designer-showcase">Designer Showcase</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
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
    </div>
  );
};

export default FashionAndBeauty;
