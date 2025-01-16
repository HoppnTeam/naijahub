import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, ShieldCheck } from "lucide-react";
import { Post } from "@/types/post";
import { AdPlacement } from "@/components/ads/AdPlacement";

export default function Index() {
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
      <Navigation />
      <main className="container py-8">
        <AdPlacement type="banner" />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to NaijaHub</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/create-post")} className="gap-2">
              <PlusCircle className="w-5 h-5" />
              Create Post
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/sign-in")}
              className="gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Admin Sign In
            </Button>
          </div>
        </div>

        <CategoryTabs
          categories={categories}
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </main>
      <Footer />
    </div>
  );
}