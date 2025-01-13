import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Briefcase, ShoppingBag, Award, BookOpen } from "lucide-react";
import { Post } from "@/types/post";
import { BackNavigation } from "@/components/BackNavigation";

const Business = () => {
  const { data: posts } = useQuery({
    queryKey: ["business-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles!posts_user_id_profiles_fkey (username, avatar_url),
          categories:categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("categories.name", "Business")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
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
    <div className="container py-8">
      <BackNavigation />
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Business Hub</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="col-span-2">
          <div className="bg-card rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Marketplace Listings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts?.filter(post => post.title.toLowerCase().includes("marketplace"))
                .slice(0, 4)
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
            <Button variant="outline" className="mt-4 w-full">View All Listings</Button>
          </div>

          <div className="bg-card rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Featured Startups</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {posts?.filter(post => post.title.toLowerCase().includes("startup"))
                .slice(0, 3)
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-card rounded-lg p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Business Resources</h2>
            </div>
            <div className="space-y-4">
              {posts?.filter(post => post.title.toLowerCase().includes("guide"))
                .slice(0, 5)
                .map((post) => (
                  <div key={post.id} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;