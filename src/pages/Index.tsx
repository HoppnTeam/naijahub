import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { CategoryTabs } from "@/components/CategoryTabs";

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  user_id: string;
  category_id: string | null;
  profiles: {
    username: string;
    avatar_url?: string | null;
  } | null;
  categories: {
    name: string;
  } | null;
  _count?: {
    comments: number;
    likes: number;
  };
}

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
        .select("*");
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
          profiles!posts_user_id_profiles_fkey (username, avatar_url),
          categories (name),
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
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
        }
      })) as Post[];
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Navigation />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to NaijaHub</h1>
          <Button onClick={() => navigate("/create-post")} className="gap-2">
            <PlusCircle className="w-5 h-5" />
            Create Post
          </Button>
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