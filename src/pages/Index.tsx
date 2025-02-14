
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/post";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components
const CategoryTabs = lazy(() => import("@/components/CategoryTabs"));
const AdPlacement = lazy(() => import("@/components/ads/AdPlacement"));

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Starting categories fetch...");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is('parent_id', null)
        .order('name');
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      console.log("Categories fetch successful:", data);
      return data || []; 
    },
    staleTime: 300000, // Cache for 5 minutes
    retry: 2,
  });

  // Log any categories error
  useEffect(() => {
    if (categoriesError) {
      console.error("Categories query error:", categoriesError);
    }
  }, [categoriesError]);

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts", selectedCategory],
    queryFn: async () => {
      console.log("Fetching posts for category:", selectedCategory);
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles!inner (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq('is_draft', false)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      
      return data.map(post => ({
        ...post,
        user: {
          id: post.user_id,
          username: post.profiles?.username || 'Unknown User',
          avatar_url: post.profiles?.avatar_url
        },
        categories: {
          name: post.categories?.name || ''
        },
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];
    },
    enabled: selectedCategory === "all" || !!selectedCategory,
    staleTime: 30000, // Cache for 30 seconds
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <AdPlacement type="banner" />
          </Suspense>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
            <div className="space-y-2 w-full">
              <h1 className="text-xl md:text-3xl font-bold text-white bg-[#32a852] px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md text-center md:text-left">
                Welcome to NaijaHub
              </h1>
              <p className="text-muted-foreground font-medium px-2 md:px-4 text-center md:text-left">
                Connect with Nigerians worldwide
              </p>
            </div>
          </div>

          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CategoryTabs
              categories={categories}
              posts={posts}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Index;
