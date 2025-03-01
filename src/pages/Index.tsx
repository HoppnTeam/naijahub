import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/hooks/use-posts";
import { useRealtimePosts } from "@/hooks/use-realtime-posts";
import { Post } from "@/types/post";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VirtualizedPostList } from "@/components/posts/VirtualizedPostList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

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
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is('parent_id', null)
        .order('name');
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      return data || []; 
    },
    staleTime: 300000, // Cache for 5 minutes
    retry: 2,
  });

  // Log any categories error
  useEffect(() => {
    if (categoriesError) {
      console.error("Categories query error:", categoriesError);
      toast.error("Failed to load categories");
    }
  }, [categoriesError]);

  const { posts, isOnline } = usePosts(selectedCategory !== "all" ? selectedCategory : undefined);

  // Enable real-time updates when online
  useRealtimePosts(selectedCategory !== "all" ? selectedCategory : undefined);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <ErrorBoundary>
            {!isOnline && (
              <Alert className="mb-4">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Offline Mode</AlertTitle>
                <AlertDescription>
                  You're currently offline. Some features may be limited, but you can still view previously loaded content.
                </AlertDescription>
              </Alert>
            )}

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
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </Suspense>

            <ErrorBoundary>
              <Suspense fallback={
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full" />
                  ))}
                </div>
              }>
                {posts && (
                  <VirtualizedPostList 
                    posts={posts} 
                    categoryId={selectedCategory !== "all" ? selectedCategory : undefined}
                  />
                )}
              </Suspense>
            </ErrorBoundary>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Index;
