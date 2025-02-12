
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scissors, Sparkles, Store } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { BackNavigation } from "@/components/BackNavigation";

const FashionAndBeauty = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["fashion-beauty-posts", selectedTab],
    queryFn: async () => {
      // First get the Fashion & Beauty category ID
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Fashion & Beauty")
        .single();

      if (!categoryData) throw new Error("Category not found");

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
        .eq("category_id", categoryData.id)
        .order("created_at", { ascending: false });

      if (selectedTab !== "all") {
        // Get the subcategory ID
        const { data: subcategory } = await supabase
          .from("categories")
          .select("id")
          .eq("name", selectedTab)
          .eq("parent_id", categoryData.id)
          .single();

        if (subcategory) {
          query = query.eq("subcategory_id", subcategory.id);
        }
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
      <BackNavigation />
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-[#E2725B]" />
            <h1 className="text-2xl font-bold">Fashion & Beauty</h1>
          </div>
          <Button onClick={() => navigate("/categories/fashion-beauty/create")}>
            Create Post
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Button 
            className="w-full md:w-auto bg-[#E2725B] hover:bg-[#E2725B]/90 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold shadow-lg transition-all hover:scale-[1.02]"
            onClick={() => navigate("/categories/fashion-beauty/business-hub/professionals")}
          >
            <Sparkles className="w-5 h-5" />
            Find Beauty Professionals
          </Button>

          <Button 
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold shadow-lg transition-all hover:scale-[1.02]"
            onClick={() => navigate("/categories/fashion-beauty/business-hub")}
          >
            <Store className="w-5 h-5" />
            Beauty Business Hub
          </Button>
        </div>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="Fashion Trends">Fashion Trends</TabsTrigger>
          <TabsTrigger value="Beauty & Skincare">Beauty & Skincare</TabsTrigger>
          <TabsTrigger value="Hair & Styling">Hair & Styling</TabsTrigger>
          <TabsTrigger value="Makeup">Makeup</TabsTrigger>
          <TabsTrigger value="Traditional">Traditional</TabsTrigger>
          <TabsTrigger 
            value="Designer Showcase" 
            onClick={(e) => {
              e.preventDefault();
              navigate("/categories/fashion-beauty/designer-directory");
            }}
          >
            Designer Showcase
          </TabsTrigger>
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
