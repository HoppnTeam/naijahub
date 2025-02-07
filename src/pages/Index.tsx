
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Post } from "@/types/post";
import { AdPlacement } from "@/components/ads/AdPlacement";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is('parent_id', null);
      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data.map(post => ({
        ...post,
        user: {
          id: post.user_id,
          username: post.profiles?.username || 'Unknown User',
          avatar_url: post.profiles?.avatar_url
        },
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];
    },
    enabled: selectedCategory === "all" || !!selectedCategory,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-poppins">
      <main className="container px-4 py-4 md:py-8">
        <AdPlacement type="banner" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#32a852] to-[#E2725B] bg-clip-text text-transparent">
              Welcome to NaijaHub
            </h1>
            <p className="text-muted-foreground">Connect with Nigerians worldwide</p>
          </div>
        </div>

        <CategoryTabs
          categories={categories}
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </main>
    </div>
  );
};

export default Index;
